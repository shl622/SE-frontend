import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";

export const NotFound = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <HelmetProvider>
                <Helmet>
                    <title>Not Found | Super Eats</title>
                </Helmet>
            </HelmetProvider>
            <h2 className="font-semibold text-2xl mb-3">Page Not Found.</h2>
            <h4 className="font-medium text-base mb-5">
                The page you're looking for does not exist or has moved.
            </h4>
            <Link className="hover:underline text-lime-600" to="/">
                Go back home &rarr;
            </Link>
        </div>
    )
}