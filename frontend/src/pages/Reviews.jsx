import { useEffect, useState } from "react";

import { artifyApi } from "../utils/artifyApi";

const Reviews = () => {
  const [orders, setOrders] = useState([]);
  const [forms, setForms] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    artifyApi
      .getUserOrders()
      .then((response) => setOrders(response.data.data || []))
      .catch(() => setOrders([]));
  }, []);

  const handleSubmit = async (artworkId) => {
    const form = forms[artworkId] || { rating: 5, comment: "" };
    await artifyApi.createReview({
      artworkId,
      rating: Number(form.rating),
      comment: form.comment,
    });
    setMessage("Review submitted successfully");
  };

  return (
    <div className="page-stack">
      <div className="section-head">
        <div>
          <span className="eyebrow">Reviews</span>
          <h1>Review your purchases</h1>
        </div>
      </div>

      {message ? <p className="success-text">{message}</p> : null}
      <div className="stack-list">
        {orders.map((order) => (
          <div key={order._id} className="panel">
            <h3>{order.artworkId?.title}</h3>
            <select
              value={forms[order.artworkId?._id]?.rating || 5}
              onChange={(event) =>
                setForms({
                  ...forms,
                  [order.artworkId?._id]: {
                    ...(forms[order.artworkId?._id] || {}),
                    rating: event.target.value,
                  },
                })
              }
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
            <textarea
              rows="3"
              placeholder="Write your review"
              value={forms[order.artworkId?._id]?.comment || ""}
              onChange={(event) =>
                setForms({
                  ...forms,
                  [order.artworkId?._id]: {
                    ...(forms[order.artworkId?._id] || {}),
                    comment: event.target.value,
                  },
                })
              }
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleSubmit(order.artworkId?._id)}
            >
              Save Review
            </button>
          </div>
        ))}
        {!orders.length ? <p>Purchase an artwork to leave a review.</p> : null}
      </div>
    </div>
  );
};

export default Reviews;
