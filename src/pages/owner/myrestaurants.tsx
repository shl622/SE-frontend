import { gql, useQuery } from "@apollo/client"
import { MyRestaurantsQuery, MyRestaurantsQueryVariables } from "../../__generated__/graphql"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { Link } from "react-router-dom"
import { Restaurant } from "../../components/restaurant"
import { VictoryChart } from "victory-chart"
import { VictoryAxis, VictoryLabel, VictoryLine, VictoryPie, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer } from "victory"
import { aggregateSales } from "./my-restaurant"

export const MY_RESTAURANTS_QUERY = gql`
    query myRestaurants {
        myRestaurants {
            ok
            error
            myRestaurants{
                id
                name
                coverImg
                category{
                    name
                }
                orders{
                    id
                    createdAt
                    total
                    status
                }
                address
                isPromoted  
            }
        }
    }
`

export const MyRestaurants = () => {
    const { data } = useQuery<MyRestaurantsQuery, MyRestaurantsQueryVariables>(MY_RESTAURANTS_QUERY)
    const aggregatedData = data?.myRestaurants.myRestaurants?.reduce((acc, restaurant) => {
        let totalOrderCount = 0
        let totalRevenue = 0

        const restaurantData = restaurant.orders.reduce((orderAcc, order) => {
            if (!orderAcc[order.createdAt]) {
                orderAcc[order.createdAt] = { orderCount: 0, totalPrice: 0 }
            }
            orderAcc[order.createdAt].orderCount += 1
            orderAcc[order.createdAt].totalPrice += order.total || 0

            totalOrderCount += 1
            totalRevenue += order.total || 0

            return orderAcc
        }, {} as Record<string, { orderCount: number, totalPrice: number }>)

        acc[restaurant.name] = {
            dailyData: restaurantData,
            totalOrders: totalOrderCount,
            totalRevenue: totalRevenue
        }
        return acc
    }, {} as Record<string, {
        dailyData: Record<string, { orderCount: number, totalPrice: number }>,
        totalOrders: number,
        totalRevenue: number
    }>)

    const dailyRevenueData = data?.myRestaurants.myRestaurants?.reduce((acc, restaurant) => {
        restaurant.orders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString()
            if (!acc[date]) {
                acc[date] = 0
            }
            acc[date] += order.total || 0
        })
        return acc
    }, {} as Record<string, number>) || {}

    let cumulativeSum = 0
    const sortedLineChartData = Object.entries(dailyRevenueData)
        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
        .map(([date, dailyRevenue]) => {
            cumulativeSum += dailyRevenue
            return {
                x: new Date(date),
                y: cumulativeSum
            }
        })

    const pieChartData = Object.entries(aggregatedData || {}).map(([name, data]) => ({
        x: name,
        y: data.totalOrders
    }))

    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>Dashboard | Super Eats</title>
                </Helmet>
            </HelmetProvider>
            <div className="flex justify-between items-center mb-6 px-3 md:px-5">
                <h1 className="text-2xl md:text-3xl font-bold">Owner Dashboard</h1>
                <Link to="/add-restaurant" className="bg-lime-500 text-white px-4 py-2 rounded-md hover:bg-lime-600">
                    + New Restaurant
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">My Restaurants</h2>
                    {data?.myRestaurants.ok && data.myRestaurants.myRestaurants?.length === 0 ? (
                        <p className="text-gray-600">You have no restaurants</p>
                    ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {data?.myRestaurants.myRestaurants?.map((restaurant: any) => (
                                <li key={restaurant.id} className="mb-2">
                                    <Restaurant key={restaurant.id} id={restaurant.id + ""} coverImg={restaurant.coverImg} name={restaurant.name} categoryName={restaurant.category?.name} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex flex-col gap-2 2xl:flex-row">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Restaurant Orders% </h2>
                        <VictoryPie
                            data={pieChartData}
                            colorScale="qualitative"
                            width={350}
                            height={300}
                            labelComponent={<VictoryLabel style={{ fontSize: 10 }} />}
                            labels={({ datum }) => datum.y > 0 ? datum.x : null}
                        />
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Total Revenue Over Time</h2>
                        <VictoryChart
                            theme={VictoryTheme.material}
                            width={350}
                            height={300}
                            containerComponent={
                                <VictoryVoronoiContainer
                                    labels={({ datum }) => `${datum.x.toLocaleDateString()}: $${datum.y.toFixed(2)}`}
                                    labelComponent={<VictoryTooltip />}
                                />
                            }
                        >
                            <VictoryAxis
                                tickFormat={(x) => new Date(x).toLocaleDateString()}
                                style={{
                                    tickLabels: { angle: -45, textAnchor: 'end', fontSize: 8 }
                                }}
                            />
                            <VictoryAxis
                                dependentAxis
                                tickFormat={(y) => `$${y}`}
                            />
                            <VictoryLine
                                data={sortedLineChartData}
                                x="x"
                                y="y"
                            />
                        </VictoryChart>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Current Orders</h2>
                    <h1>Current Orders</h1>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Archived Orders</h2>
                    {/* Add archived orders content here */}
                </div>
            </div>
        </div>
    )
}