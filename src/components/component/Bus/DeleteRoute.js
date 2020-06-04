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
var _sourceList = ["Choose Source"];
var _endList = ["Choose Destination"];
var _source;

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
  await ref.on("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      sourceList = sourceList.concat(childSnapshot.child("start").val());
    });
  });
}

async function _populate_source_list() {
  await ref.on("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.child("end").exists()) {
        _sourceList = _sourceList.concat(childSnapshot.child("start").val());
      }
    });
  });
}

function populate_destination_list() {
  ref.on("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.child("start").val() === _source) {
        ref
          .child(childSnapshot.key)
          .child("end")
          .once("value", (ds) => {
            ds.forEach((snap) => {
              _endList = _endList.concat(snap.child("name").val());
            });
          });
      }
    });
  });
}

populate_source_list();
_populate_source_list();

export default function EditRoute() {
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
  const [sourceX, setSourceX] = React.useState("");
  const [end, setEnd] = React.useState("");
  const [dest, setDest] = React.useState("");

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
          <Tab label="Delete Source" {...a11yProps(0)} />
          <Tab label="Delete Destination" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <NativeSelect
            style={{
              marginTop: 10,
              width: "100%",
            }}
            value={source}
            name="Source"
            onChange={(e) => setSource(e.target.value)}
            inputProps={{ "aria-label": "service" }}
          >
            {sourceList.map((x) => (
              <option value={x}>{x}</option>
            ))}
          </NativeSelect>
          <FormHelperText>
            Choose Source (Wait if you see the list empty as data being loaded)
          </FormHelperText>

          {successAlert ? (
            <Alert
              variant="outlined"
              style={{ marginBottom: 15 }}
              severity="success"
            >
              Source is successfully deleted to the database!
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
              Please fill source or choose!
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
              if (source === "Choose Source" || source === "") {
                setWarningAlert(true);
              } else {
                setLoading(true);
                setWarningAlert(false);

                ref.once("value", (snapshot) => {
                  snapshot.forEach((ds) => {
                    if (ds.child("start").val() === source) {
                      ref.child(ds.key).remove();
                      alert("Source Deleted");
                      setLoading(false);
                      window.location.reload();
                    }
                  });
                });
              }
            }}
          >
            {!loading ? "Delete Source" : <CircularProgress />}
          </Button>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <NativeSelect
            style={{
              marginTop: 10,
              width: "100%",
            }}
            value={sourceX}
            name="Source"
            onChange={(e) => {
              setSourceX(e.target.value);
              _source = e.target.value;
              populate_destination_list();
            }}
            inputProps={{ "aria-label": "service" }}
          >
            {_sourceList.map((x) => (
              <option value={x}>{x}</option>
            ))}
          </NativeSelect>
          <FormHelperText>
            Choose Source (Wait if you see the list empty as data being loaded)
          </FormHelperText>
          <NativeSelect
            style={{
              marginTop: 10,
              width: "100%",
            }}
            value={dest}
            name="Destination"
            onChange={(e) => setDest(e.target.value)}
            inputProps={{ "aria-label": "service" }}
          >
            {_endList.map((x) => (
              <option value={x}>{x}</option>
            ))}
          </NativeSelect>
          <FormHelperText>
            Choose Destination (Wait if you see the list empty as data being
            loaded)
          </FormHelperText>

          {successAlert ? (
            <Alert
              variant="outlined"
              style={{ marginBottom: 15 }}
              severity="success"
            >
              Destination is successfully deleted to the database!
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
              Please choose destination or choose source!
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
              if (
                _source === "Choose Source" ||
                dest === "Choose Destination" ||
                dest === "" ||
                _source === ""
              ) {
                setWarningAlert(true);
              } else {
                setLoading(true);
                setWarningAlert(false);

                ref.once("value", (snapshot) => {
                  snapshot.forEach((ds) => {
                    if (ds.child("start").val() === _source) {
                      ref
                        .child(ds.key)
                        .child("end")
                        .once("value", (val) => {
                          val.forEach((v) => {
                            if (v.child("name").val() === dest) {
                              ref
                                .child(ds.key)
                                .child("end")
                                .child(v.key)
                                .remove();
                              alert("Destination Deleted");
                              setLoading(false);
                              window.location.reload();
                            }
                          });
                        });
                    }
                  });
                });
              }
            }}
          >
            {!loading ? "Delete Destination" : <CircularProgress />}
          </Button>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
