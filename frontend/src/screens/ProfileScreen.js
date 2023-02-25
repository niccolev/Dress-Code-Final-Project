import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Button,
  Container,
  FormGroup,
  FormLabel,
  FormControl,
  Alert,
  Table
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { listMyOrders } from "../actions/orderActions";
import { LinkContainer } from 'react-router-bootstrap'


function ProfileScreen({ history }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading:loadingOrders, error:errorOrders, orders } = orderListMy;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user || !user.name || success || userInfo._id !== user._id) {
        dispatch({type:USER_UPDATE_PROFILE_RESET})
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrders())
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [history, userInfo, dispatch, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(updateUserProfile({
        'id': user._id,
        'name': name,
        'email': email,
        'password': password
      }));
      setMessage("");
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile </h2>
        <Avatar
          sx={{ width: 75, height: 75 }}
          alt="profile picture"
          src="/static/images/avatar/1.jpg"
        />

        {message && <Alert variant="danger">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <FormGroup controlId="email">
            <FormLabel>Name</FormLabel>
            <FormControl
              required
              type="name"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></FormControl>
          </FormGroup>

          <FormGroup controlId="email">
            <FormLabel>Email Address</FormLabel>
            <FormControl
              required
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></FormControl>
          </FormGroup>

          <FormGroup controlId="password">
            <FormLabel>New Password</FormLabel>
            <FormControl
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></FormControl>
          </FormGroup>

          <FormGroup controlId="passwordConfirm">
            <FormLabel>Confirm Password</FormLabel>
            <FormControl
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></FormControl>
          </FormGroup>

          {/* <FormGroup controlId="profilePicture">
            <FormLabel>Upload a Profile Picture</FormLabel>
            <input type="file"/>
          </FormGroup> */}

          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>

      <Col md={9}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <Loader/>
        ) : errorOrders ? (
          <Alert variant="danger"> {errorOrders} </Alert>
        ) : (
          <Table striped responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : (
                    <i className="fas fa-times" style={{color: 'red'}}></i>
                  )}</td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                        <Button className="btn-sm"> Details </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}

export default ProfileScreen;
