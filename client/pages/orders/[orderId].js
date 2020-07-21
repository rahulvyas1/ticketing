import { useState, useEffect } from "react";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";

const OrderShow = ({ order, currentUser }) => {
  const [timeleft, setTimeleft] = useState(0);
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeleft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => {
      console.log(payment);
      Router.push("/orders");
    },
  });

  if (timeleft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <div>Time left to pay: {timeleft + " seconds"}</div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51H74oVBTsWIp1yjjE1UH0tfGZOHZAjzYdkDyGLLwvxQzhuVEqZbhyPLmjT5v8iNEQa3nDsNn5lsXJCKWBMlA9Ltj00Q1sSY5BJ"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  console.log(data);
  return { order: data };
};

export default OrderShow;
