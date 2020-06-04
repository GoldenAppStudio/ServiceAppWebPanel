import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Add from "@material-ui/icons/AddBoxRounded";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import firebase from "firebase";
import FormHelperText from "@material-ui/core/FormHelperText";
import NativeSelect from "@material-ui/core/NativeSelect";

const database = firebase.database();
const ref = database.ref("BusRoute");
var sourceList = ["Choose Source"];

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
      {value === index && <Box p={1}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  button: {
    width: 500,
    marginTop: 20,
    marginLeft: "22%",
    marginRight: "22%",
  },
  container: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

async function populate_source_list() {
  await ref.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      sourceList = sourceList.concat(childSnapshot.child("start").val());
    });
  });
}

populate_source_list();

export default function AddRoute() {
  const classes = useStyles();
  const theme = useTheme();

  const [value, setValue] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);
  const [successAlert, setSuccessAlert] = React.useState(false);
  const [warningAlert, setWarningAlert] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [start, setStart] = React.useState("");
  const [source, setSource] = React.useState("");
  const [end, setEnd] = React.useState("");

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

  const handleChangeIndex = (index) => {
    setValue(index);
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
          <Tab label="Add Source" {...a11yProps(0)} />
          <Tab label="Add Destination" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Source"
            name="email"
            autoComplete="email"
            style={{ marginBottom: 20 }}
            onChange={(e) => {
              setStart(e.target.value);
            }}
          />
          {successAlert ? (
            <Alert
              variant="outlined"
              style={{ marginBottom: 15 }}
              severity="success"
            >
              Source is successfully added to the database!
            </Alert>
          ) : (
            ""
          )}

          {warningAlert ? (
            <Alert
              variant="outlined"
              severity="warning"
              style={{ marginBottom: 15 }}
            >
              Please fill source!
            </Alert>
          ) : (
            ""
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className={classes.submit}
            disabled={loading}
            startIcon={<Add />}
            onClick={() => {
              if (start === "") {
                setWarningAlert(true);
              } else {
                setLoading(true);
                setWarningAlert(false);

                ref.once("value", (snapshot) => {
                  if (snapshot.exists()) {
                    var count = snapshot.numChildren();
                    ref.child(count + 1).set({
                      start: start,
                    });
                    alert("Source Added");
                    setLoading(false);
                    window.location.reload();
                  } else {
                    ref.child(1).set({
                      start: start,
                    });
                    alert("Source Added");
                    setLoading(false);
                    window.location.reload();
                  }
                });
              }
            }}
          >
            {!loading ? "Add Source" : <CircularProgress />}
          </Button>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <NativeSelect
            style={{
              marginTop: 10,
              width: "100%",
            }}
            value={source}
            name="Source"
            onChange={(e) => {
              setSource(e.target.value);
            }}
            inputProps={{ "aria-label": "service" }}
          >
            {sourceList.map((x) => (
              <option value={x}>{x}</option>
            ))}
          </NativeSelect>
          <FormHelperText>
            Choose Source (Wait if you see the list empty as data being loaded)
          </FormHelperText>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Destination"
            name="email"
            autoComplete="email"
            style={{ marginBottom: 20 }}
            onChange={(e) => {
              setEnd(e.target.value);
            }}
          />
          {successAlert ? (
            <Alert
              variant="outlined"
              style={{ marginBottom: 15 }}
              severity="success"
            >
              Destination is successfully added to the database!
            </Alert>
          ) : (
            ""
          )}

          {warningAlert ? (
            <Alert
              variant="outlined"
              severity="warning"
              style={{ marginBottom: 15 }}
            >
              Please fill destination or choose source!
            </Alert>
          ) : (
            ""
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className={classes.submit}
            disabled={loading}
            startIcon={<Add />}
            onClick={() => {
              if (source === "Choose Source" || end === "") {
                setWarningAlert(true);
              } else {
                setLoading(true);
                setWarningAlert(false);

                ref.once("value", (snapshot) => {
                  snapshot.forEach((ds) => {
                    if (ds.child("start").val() === source) {
                      if (ds.child("end").exists()) {
                        var count = ds.child("end").numChildren();
                        ref
                          .child(ds.key)
                          .child("end")
                          .child(count + 1)
                          .set({ name: end });
                        alert("Destination Added");
                        setLoading(false);
                        window.location.reload();
                      } else {
                        ref
                          .child(ds.key)
                          .child("end")
                          .child("1")
                          .set({ name: end });
                        alert("Destination Added");
                        setLoading(false);
                        window.location.reload();
                      }
                    }
                  });
                });
              }
            }}
          >
            {!loading ? "Add Destination" : <CircularProgress />}
          </Button>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
