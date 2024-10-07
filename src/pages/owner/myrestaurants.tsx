import { gql, useQuery } from "@apollo/client"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { Link } from "react-router-dom"
import { VictoryAxis, VictoryLabel, VictoryLine, VictoryPie, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer } from "victory"
import { VictoryChart } from "victory-chart"
import { MyRestaurantsQuery, MyRestaurantsQueryVariables } from "../../__generated__/graphql"
import { Restaurant } from "../../components/restaurant"
import { OrderStatus } from "../../constants"

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
                    restaurant{
                        name
                    }
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

    const getOrderStatusDisplay = (status: OrderStatus): string => {
        switch (status) {
            case OrderStatus.InProgress:
                return 'In Progress'
            case OrderStatus.WaitingForPickUp:
                return 'Waiting for Delivery Pickup'
            case OrderStatus.PickedUp:
                return 'Picked Up'
            case OrderStatus.Pending:
                return 'Pending'
            default:
                return status
        }
    }

    const calculateTimePassed = (createdAt: string) => {
        const orderDate = new Date(createdAt)
        const currentDate = new Date()
        const diffInMinutes = Math.floor((currentDate.getTime() - orderDate.getTime()) / (1000 * 60))
        return diffInMinutes
    }

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
                        <h2 className="text-xl font-semibold mb-4">Restaurant Orders </h2>
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
                    {data?.myRestaurants.myRestaurants?.map((restaurant: any) => (
                        <div key={restaurant.id}>
                            <ul>
                                {restaurant.orders
                                    .filter((order: any) => order.status !== 'Delivered')
                                    .map((order: any) => (
                                        <div className="px-8 py-4 border cursor-pointer hover:border-gray-800 transition-all flex flex-col" key={order.id}>
                                            <h3 className="text-lg font-bold">{order.restaurant.name}</h3>
                                            <span className="font-medium mb-5">
                                                {calculateTimePassed(order.createdAt)} minutes ago
                                            </span>
                                            <span className="font-medium">
                                                {getOrderStatusDisplay(order.status as OrderStatus)}
                                            </span>
                                            <span className="font-light">${order.total.toFixed(2)}</span>
                                        </div>
                                    ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Archived Orders</h2>
                    {data?.myRestaurants.myRestaurants?.map((restaurant: any) => (
                        <div key={restaurant.id}>
                            <ul>
                                {restaurant.orders
                                    .filter((order: any) => order.status === 'Delivered')
                                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                    .map((order: any) => (
                                        <div className="px-8 py-4 border cursor-pointer hover:border-gray-800 transition-all flex flex-col" key={order.id}>
                                            <h3 className="text-lg font-medium">{order.restaurant.name}</h3>
                                            <span className="font-medium mb-5">
                                                {order.createdAt.split('T')[0]}
                                            </span>
                                            <span className="font-medium">{order.status}</span>
                                            <span className="font-light">${order.total.toFixed(2)}</span>
                                        </div>
                                    ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}