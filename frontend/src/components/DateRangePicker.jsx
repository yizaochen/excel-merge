import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

const DateRangePicker = ({ startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <div>
      <Form.Group className="my-3" controlId="startDate">
        <Form.Label>Start Date</Form.Label>
        <div className="d-flex">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="form-control"
          />
        </div>
      </Form.Group>
      <Form.Group className="my-3" controlId="endDate">
        <Form.Label>End Date</Form.Label>
        <div className="d-flex">
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="form-control"
          />
        </div>
      </Form.Group>
    </div>
  );
};

export default DateRangePicker;
