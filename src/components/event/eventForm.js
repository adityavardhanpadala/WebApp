import React, {useState} from "react";
import {DatePicker} from "antd";
import {extendMoment} from "moment-range";
import Moment from "moment";
import dataFetch from "../../utils/dataFetch";

const EventForm = () => {
  const moment = extendMoment(Moment);
  const [isLoading, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [error, setErrorText] = useState("");
  const [success, setSuccessText] = useState("");

  const query = `
    mutation createEvent($name: String!, $details: String!, $startDate: Date!, $endDate: Date!){
      createEvent(details:$details, endTimestamp:$endDate, startTimestamp: $startDate, name:$name){
        id
      }
    }
  `;

  const submitForm = async variables =>
    dataFetch({ query, variables });

  const register = () => {
    const variables = { name, details, startDate, endDate };
    submitForm(variables).then(r=>{
      if (Object.prototype.hasOwnProperty.call(r, "errors")) {
        setErrorText(r.errors[0].message)
      } else {
        setSuccessText(r.data.id);
        setErrorText("");
      }
    })
  };
  return !isLoading ? (
    <form
      className="form-group"
      onSubmit={e => {
        setLoaded(true);
        register();
        e.preventDefault();
      }}>
      <div className="page-container">
        <div className="row m-0">
          <div className="col-md-6">
            <label>Name of the event</label>
            <div className="m-2">
              <input
                type="text"
                placeholder="Enter Name"
                name="name"
                className="form-control"
                onChange={e => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <label>From</label>
            <div className="m-2">
              <DatePicker
                size="large"
                onChange={e => {
                  setLoaded(false);
                  setStartDate(e.format('YYYY-MM-DD'));
                }}
                format="DD-MM-YYYY"
                value={moment(startDate)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <label>To</label>
            <div className="m-2">
              <DatePicker
                size="large"
                onChange={e => {
                  setLoaded(false);
                  setEndDate(e.format('YYYY-MM-DD'));
                }}
                format="DD-MM-YYYY"
                value={moment(endDate)}
              />
            </div>
          </div>
          <div className="col-md-12">
            <label>Details</label>
            <div className="m-2">
              <textarea
                className="form-control"
                rows="5" cols = "40"
                placeholder="Details about event"
                name="expecting"
                onChange={e => setDetails(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="text-right m-3">
          <button
            type="submit"
            className="button btn ant-btn-primary px-4"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  ):
  <div>
    {
      success!== '' ? (
        <div className="alert alert-success m-4">
        Successfully added the event
        </div>
      ) :
      <div className="alert alert-warning m-4">Submitting. Please Wait</div>
    }
  </div>
};

export default EventForm
