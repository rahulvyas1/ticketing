import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import Router from 'next/router'
const NewTicket = ({ currentUser }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: (ticket) => {
      console.log(ticket);
      Router.push('/')
    },
  });
  const onBlur = () => {
    const val = parseFloat(price);
    if (isNaN(val)) {
      return;
    }
    setPrice(val.toFixed(2));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };
  return currentUser ? (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  ) : (
    <h1>You are not signed in</h1>
  );
};



export default NewTicket;
