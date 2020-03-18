import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import firebase from "../../Firebase";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2)
    }
  },
  button: {
    width: 500,
    marginTop: 20,
    marginLeft: "22%",
    marginRight: "22%"
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: theme.palette.background.paper
  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

export default function Travel() {
  const classes = useStyles();
  const theme = useTheme();
  var cabLink, planeLink, shipLink, hotelLink, tripLink, trainLink;
  var phoneText, emailText;
  var username, password;
  var notification;

  const database = firebase.database();
  const ref = database.ref("Travel");
  const ref2 = database.ref("ContactDetails");
  const ref3 = database.ref("AdminLogin");
  const ref4 = database.ref("Notification");

  ref.on("value", snapshot => {
    cabLink = snapshot.child("cab").val();
    planeLink = snapshot.child("plane").val();
    tripLink = snapshot.child("trip").val();
    trainLink = snapshot.child("train").val();
    hotelLink = snapshot.child("hotel").val();
    shipLink = snapshot.child("ship").val();
  });

  ref2.on("value", snapshot => {
    emailText = snapshot.child("email").val();
    phoneText = snapshot.child("phone").val();
  });

  ref3.on("value", snapshot => {
    username = snapshot.child("user").val();
    password = snapshot.child("pass").val();
  });

  ref4.on("value", snapshot => {
    notification = snapshot.child("text").val();
  });

  const TRIP = tripLink;
  const CAB = cabLink;
  const PLANE = planeLink;
  const TRAIN = trainLink;
  const HOTEL = hotelLink;
  const SHIP = shipLink;
  const EMAIL = emailText;
  const PHONE = phoneText;
  const USER = username;
  const PASS = password;
  const N = notification;

  const [value, setValue] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);
  const [trip, setTrip] = useState(tripLink);
  const [hotel, setHotel] = useState(hotelLink);
  const [ship, setShip] = useState(shipLink);
  const [plane, setPlane] = useState(planeLink);
  const [cab, setCab] = useState(cabLink);
  const [train, setTrain] = useState(trainLink);
  const [email, setEmail] = useState(emailText);
  const [phone, setPhone] = useState(phoneText);
  const [user, setUser] = useState(username);
  const [pass, setPass] = useState(password);
  const [n, setN] = useState(notification);

  const progress = React.useRef(() => {});
  React.useEffect(() => {
    progress.current = () => {
      if (completed > 100) {
        setCompleted(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 10;
        const diff2 = Math.random() * 10;
        setCompleted(completed + diff);
        setBuffer(completed + diff + diff2);
      }
    };
  });

  React.useEffect(() => {
    function tick() {
      progress.current();
    }
    const timer = setInterval(tick, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  const update_links_in_db = () => {
    if (trip === "") {
      database
        .ref("Travel")
        .child("trip")
        .set(TRIP);
    } else if (trip !== undefined) {
      database
        .ref("Travel")
        .child("trip")
        .set(trip);
    } else {
    }

    if (train === "") {
      database
        .ref("Travel")
        .child("train")
        .set(TRAIN);
    } else if (train !== undefined) {
      database
        .ref("Travel")
        .child("train")
        .set(train);
    } else {
    }

    if (plane === "") {
      database
        .ref("Travel")
        .child("plane")
        .set(PLANE);
    } else if (plane !== undefined) {
      database
        .ref("Travel")
        .child("plane")
        .set(plane);
    } else {
    }

    if (cab === "") {
      database
        .ref("Travel")
        .child("cab")
        .set(CAB);
    } else if (cab !== undefined) {
      database
        .ref("Travel")
        .child("cab")
        .set(cab);
    } else {
    }

    if (hotel === "") {
      database
        .ref("Travel")
        .child("hotel")
        .set(HOTEL);
    } else if (hotel !== undefined) {
      database
        .ref("Travel")
        .child("hotel")
        .set(hotel);
    } else {
    }

    if (ship === "") {
      database
        .ref("Travel")
        .child("ship")
        .set(SHIP);
    } else if (ship !== undefined) {
      database
        .ref("Travel")
        .child("ship")
        .set(ship);
    } else {
    }

    alert("Data updated and synced successfully.");
  };

  const update_contact_info = () => {
    if (email === "") {
      database
        .ref("ContactDetails")
        .child("email")
        .set(EMAIL);
    } else if (email !== undefined) {
      database
        .ref("ContactDetails")
        .child("email")
        .set(email);
    } else {
    }

    if (phone === "") {
      database
        .ref("ContactDetails")
        .child("phone")
        .set(PHONE);
    } else if (phone !== undefined) {
      database
        .ref("ContactDetails")
        .child("phone")
        .set(phone);
    } else {
    }

    alert("Data updated and synced successfully.");
  };

  const update_login_details = () => {
    if (user === "") {
      database
        .ref("AdminLogin")
        .child("user")
        .set(USER);
    } else if (user !== undefined) {
      database
        .ref("AdminLogin")
        .child("user")
        .set(user);
    } else {
    }

    if (pass === "") {
      database
        .ref("AdminLogin")
        .child("pass")
        .set(PASS);
    } else if (pass !== undefined) {
      database
        .ref("AdminLogin")
        .child("pass")
        .set(pass);
    } else {
    }

    alert("Data updated and synced successfully.");
  };

  const update_notification = () => {
    if (n === "") {
      database
        .ref("Notification")
        .child("text")
        .set(N);
    } else if (n !== undefined) {
      database
        .ref("Notification")
        .child("text")
        .set(n);
    } else {
    }

    alert("Data updated and synced successfully.");
  };

  return (
    <div className={classes.container}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Travel Links" {...a11yProps(0)} />
          <Tab label="Contact Info" {...a11yProps(1)} />
          <Tab label="Login & Notification" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel
          value={value}
          index={0}
          dir={theme.direction}
          style={{ margin: 20 }}
        >
          <div>
            <TextField
              id="outlined-full-width"
              label="Trips"
              style={{ margin: 8, marginTop: 1, width: "100%" }}
              value={trip}
              placeholder={tripLink}
              margin="normal"
              required
              onChange={e => setTrip(e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
            />
            <TextField
              id="outlined-full-width"
              label="Hotels"
              style={{ margin: 8, width: "100%" }}
              placeholder={hotelLink}
              value={hotel}
              required
              onChange={e => setHotel(e.target.value)}
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
            />
            <TextField
              id="outlined-full-width"
              label="Flights"
              style={{ margin: 8, width: "100%" }}
              placeholder={planeLink}
              value={plane}
              onChange={e => setPlane(e.target.value)}
              required
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
            />
            <TextField
              id="outlined-full-width"
              label="Trains"
              style={{ margin: 8, width: "100%" }}
              placeholder={trainLink}
              value={train}
              onChange={e => setTrain(e.target.value)}
              required
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
            />
            <TextField
              id="outlined-full-width"
              label="Cab & Taxi"
              style={{ margin: 8, width: "100%" }}
              placeholder={cabLink}
              value={cab}
              onChange={e => setCab(e.target.value)}
              required
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
            />
            <TextField
              id="outlined-full-width"
              label="Cruise Ship & Yatches"
              style={{ margin: 8, width: "100%" }}
              placeholder={shipLink}
              value={ship}
              onChange={e => setShip(e.target.value)}
              required
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
            />

            <Button
              variant="contained"
              color="primary"
              style={{}}
              onClick={update_links_in_db}
              className={classes.button}
              startIcon={<CloudUploadIcon />}
            >
              Update Database
            </Button>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <h2>In-App Ad Request Contact</h2>
          <TextField
            id="outlined-full-width"
            label="Email"
            style={{ margin: 8, marginTop: 30, width: "100%" }}
            placeholder={emailText}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            variant="outlined"
          />
          <TextField
            id="outlined-full-width"
            label="Phone"
            style={{ margin: 8, marginTop: 38, width: "100%" }}
            placeholder={phoneText}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            variant="outlined"
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 50 }}
            onClick={update_contact_info}
            className={classes.button}
            startIcon={<CloudUploadIcon />}
          >
            Update Database
          </Button>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <h5>Change Username or Password</h5>
          <TextField
            id="outlined-full-width"
            label="Enter New Username"
            style={{ margin: 8, marginTop: 7, width: "100%" }}
            placeholder={username}
            value={user}
            onChange={e => setUser(e.target.value)}
            required
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            variant="outlined"
          />
          <TextField
            id="outlined-full-width"
            label="Enter New Password"
            style={{ margin: 8, marginTop: 10, width: "100%" }}
            placeholder={password}
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            variant="outlined"
          />
          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: 15 }}
            onClick={update_login_details}
            className={classes.button}
            startIcon={<CloudUploadIcon />}
          >
            Update Login Details
          </Button>
          <h5>Notification</h5>
          <TextareaAutosize
            aria-label="empty textarea"
            placeholder={notification}
            value={n}
            onChange={e => setN(e.target.value)}
            style={{ marginTop: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 10 }}
            onClick={update_notification}
            className={classes.button}
            startIcon={<CloudUploadIcon />}
          >
            Update Notification
          </Button>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
