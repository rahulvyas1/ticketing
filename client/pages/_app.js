import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
      <Component currentUser={currentUser} {...pageProps} />
      </div>

    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  let data = null;
  try {
    data = await client.get("/api/users/currentuser");
    data = data.data;
  } catch (e) {}

  let pageProps = {};
  console.log('data.currentUser',data)
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
