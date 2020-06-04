import React, { Component } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { storage } from "../../Firebase";
import firebase from "firebase";
import ImageUploader from "react-images-upload";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormHelperText from "@material-ui/core/FormHelperText";
import NativeSelect from "@material-ui/core/NativeSelect";
import Alert from "@material-ui/lab/Alert";

const database = firebase.database();
const ref = database.ref("Bus");
var storageRef = firebase.storage().ref();
var data = [];
var startList = [];
var endList = [];

var d;
storageRef
  .child(`ads_images/${3}.jpg`)
  .getDownloadURL()
  .then(function (url) {
    this.setState({ showImage: url });
    d = url;
  })
  .catch(function () {});

export default class BusSystem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _Name: "",
      _StartPlace: "",
      _EndPlace: "",
      _StartTime: "",
      _EndTime: "",
      _Fair: "",
      _DNo: "",
      _CNo: "",
      _DName: "",
      _CName: "",
      _Start: "",
      _End: "",
      _UID: "",
      snap: {},
      open: false,
      count: 0,
      scroll: "paper",
      editing: false,
      start: true,
      _startPlaceMatch: false,
      _endPlaceMatch: false,
      loading: false,
      _wrong: false,
      _warning: false,
      _loading: false,
    };
    this.interval = setInterval(
      () => this.setState({ time: Date.now() }),
      1000
    );
    this.get_bus = this.get_bus.bind(this);
  }

  async get_bus() {
    this.setState({ start: false });
    var dataSnapshot = await ref
      .child(this.state._Start)
      .child(this.state._End)
      .once("value");
    data = dataSnapshot.val();
  }

  Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  async get_child_count() {
    await ref.once("value", (snapshot) => {
      this.setState({ count: snapshot.numChildren() });
    });
  }

  add_bus = () => {
    if (
      this.state._Name === "" ||
      this.state._Fair === "" ||
      this.state._StartTime === "" ||
      this.state._EndTime === ""
    ) {
      alert("Please add all required field!");
      this.setState({ loading: false });
    } else {
      var ref1 = database.ref("Bus");
      ref1
        .child(this.state._Start)
        .child(this.state._End)
        .once("value", (snapshot) => {
          if (snapshot.exists()) {
            var count = snapshot.numChildren();
            ref1
              .child(this.state._Start)
              .child(this.state._End)
              .child(count + 1)
              .set({
                cname: this.state._CName,
                cno: this.state._CNo,
                dname: this.state._DName,
                dno: this.state._DNo,
                name: this.state._Name,
                fair: this.state._Fair,
                start: this.state._StartTime,
                end: this.state._EndTime,
                source: this.state._Start,
                destination: this.state._End,
                uid: count + 1,
              });
            this.setState({ loading: false, open: false });
            window.location.reload();
          } else {
            ref1
              .child(this.state._Start)
              .child(this.state._End)
              .child("1")
              .set({
                cname: this.state._CName,
                cno: this.state._CNo,
                dname: this.state._DName,
                dno: this.state._DNo,
                name: this.state._Name,
                fair: this.state._Fair,
                start: this.state._StartTime,
                end: this.state._EndTime,
                source: this.state._Start,
                destination: this.state._End,
                uid: "1",
              });
            this.setState({ loading: false, open: false });
            window.location.reload();
          }
        });
    }
  };

  async upload_ad_data() {
    ref
      .child(this.state.count + 1)
      .child("name")
      .set(this.state.name.trim());
    ref
      .child(this.state.count + 1)
      .child("address")
      .set(this.state.address.trim());
    ref
      .child(this.state.count + 1)
      .child("email")
      .set(this.state.email.trim());
    ref
      .child(this.state.count + 1)
      .child("phone")
      .set(this.state.phone.trim());
    ref
      .child(this.state.count + 1)
      .child("priority")
      .set(parseInt(this.state.priority.trim()));
    ref
      .child(this.state.count + 1)
      .child("shortDisc")
      .set(this.state.shortDescription.trim());
    ref
      .child(this.state.count + 1)
      .child("longDisc")
      .set(this.state.longDescription.trim());
    ref
      .child(this.state.count + 1)
      .child("id")
      .set(this.state.count + 1);
    ref
      .child(this.state.count + 1)
      .child("UID")
      .set(this.state.count + 1);
    ref
      .child(this.state.count + 1)
      .child("website")
      .set(this.state.website.trim());
    alert("Ad Published.");
    window.location.reload();
    this.setState({ open: false, loading: false });
  }

  handleOpen = (scrollType) => () => {
    this.setState({
      editing: true,
      scroll: scrollType,
    });
  };

  edit_ad = (snapshot) => () => {
    this.get_total_count(snapshot);
    return <div></div>;
  };

  delete_ad = (e, snapshot) => {
    ref
      .child(this.state._Start)
      .child(this.state._End)
      .child(snapshot)
      .remove();
    this.adjust_database(snapshot);
  };

  async return_data(i, id) {
    var dataSnapshotVal;
    var ref2 = database
      .ref("Bus")
      .child(this.state._Start)
      .child(this.state._End)
      .child(`${id + 1 + i}`);

    try {
      dataSnapshotVal = await ref2.once("value");
      return dataSnapshotVal.val();
    } catch (error) {}
    return dataSnapshotVal;
  }

  async adjust_database(id) {
    if (id < this.state.count) {
      var loopCount = this.state.count - id;
      // console.log(loopCount + " loopCount");
      for (var i = 0; i < loopCount; i++) {
        var newData = await this.return_data(i, id);
        setTimeout(() => {}, 6);
        ref
          .child(this.state._Start)
          .child(this.state._End)
          .child(`${id + i}`)
          .set(newData);
        ref
          .child(this.state._Start)
          .child(this.state._End)
          .child(`${id + i}`)
          .child("uid")
          .set(parseInt(id + i));
      }
    }
    ref.child(this.state.count).remove();
    setTimeout(() => {}, 3);
    this.setState({ loading: false });
    window.location.reload();
    alert("Bus removed from database.");
  }

  get_ad_table = (snapshot) => {
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.name}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.source}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.destination}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.start}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.end}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.fair}</Typography>
          </div>
        </ExpansionPanelSummary>

        <Divider />
        <ExpansionPanelActions>
          <Button
            onClick={() => {
              this.setState({
                editing: true,
                snap: snapshot,
              });
            }}
            variant="outlined"
            color="primary"
          >
            Edit
          </Button>
          <Button
            onClick={(e) => {
              this.setState({
                _warning: true,
                _UID: snapshot.uid,
              });
            }}
            variant="outlined"
            color="secondary"
          >
            {this.state._loading ? (
              <CircularProgress style={{ width: 20, height: 20 }} />
            ) : (
              <div>Delete</div>
            )}
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  };

  update_data = () => {
    ref
      .child(this.state.snap.source)
      .child(this.state.snap.destination)
      .child(this.state.snap.uid)
      .update(this.state.snap);

    this.setState({ loading: false, editing: false });
    window.location.reload();
    alert("In-App Ad updated in database.");
  };

  get_start_items = () => {
    var ref3 = database.ref("BusRoute");
    ref3.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        startList = startList.concat(childSnapshot.child("start").val());
      });
    });
  };

  get_end_items = (e) => {
    var ref4 = database.ref("BusRoute");
    ref4.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.child("start").val() === e) {
          childSnapshot.child("end").forEach((snapshot) => {
            endList = endList.concat(snapshot.child("name").val());
          });
        }
      });
    });
  };

  componentDidMount() {
    this.get_child_count();
    this.get_start_items();
  }

  render() {
    return (
      <div>
        <h2 style={{ textAlign: "center" }}>Bus Systems</h2>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
          >
            <div style={{ flexBasis: "33.33%" }}>
              <Typography>Name</Typography>
            </div>
            <div style={{ flexBasis: "33.33%" }}>
              <Typography>Source</Typography>
            </div>
            <div style={{ flexBasis: "33.33%" }}>
              <Typography>Destination</Typography>
            </div>
            <div style={{ flexBasis: "33.33%" }}>
              <Typography>Start Time</Typography>
            </div>
            <div style={{ flexBasis: "33.33%" }}>
              <Typography>End Time</Typography>
            </div>
            <div style={{ flexBasis: "33.33%" }}>
              <Typography>Fare</Typography>
            </div>
          </ExpansionPanelSummary>
        </ExpansionPanel>
        <Fab
          onClick={() => {
            if (
              this.state._Start === "" ||
              this.state._End === "" ||
              this.state._Start === "Choose Source" ||
              this.state._End === "Choose Destination"
            ) {
              alert("Please choose starting and ending points");
            } else this.setState({ open: true });
          }}
          color="primary"
          aria-label="add"
          style={{ right: 35, position: "fixed", bottom: 35 }}
        >
          <AddIcon />
        </Fab>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
          TransitionComponent={this.Transition}
        >
          <AppBar
            style={{
              position: "relative",
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => this.setState({ open: false })}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography
                variant="h6"
                style={{
                  marginLeft: 8,
                  flex: 1,
                }}
              >
                Add new Bus
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={() => {
                  this.setState({ loading: true });
                  this.add_bus();
                }}
              >
                {this.state.loading ? (
                  <CircularProgress
                    style={{ width: 40, height: 40, color: "#fff" }}
                  />
                ) : (
                  <div>Add</div>
                )}
              </Button>
            </Toolbar>
          </AppBar>
          <div style={{ flexGrow: 1, margin: 10 }}>
            <Grid container>
              <Grid item xs={6}>
                <TextField
                  id="outlined-full-width"
                  label="Type"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder="Roadways/Private"
                  required
                  onChange={(e) => {
                    this.setState({ _Name: e.target.value });
                  }}
                  name="name"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />

                <TextField
                  id="outlined-full-width"
                  label="Start Time"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder="start time"
                  required
                  onChange={(e) => {
                    this.setState({ _StartTime: e.target.value });
                  }}
                  name="email"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="End Time"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder="End Time"
                  onChange={(e) => {
                    this.setState({ _EndTime: e.target.value });
                  }}
                  name="phone"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="Fair"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder="Fair"
                  onChange={(e) => {
                    this.setState({ _Fair: e.target.value });
                  }}
                  name="website"
                  required
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="outlined-full-width"
                  label="Driver's name"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder="Driver's name"
                  onChange={(e) => {
                    this.setState({ _DName: e.target.value });
                  }}
                  name="address"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="Driver's no"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder="Driver's no"
                  onChange={(e) => {
                    this.setState({ _DNo: e.target.value });
                  }}
                  name="shortDescription"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="Conductor's name"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder="Conductor's name"
                  onChange={(e) => this.setState({ _CName: e.target.value })}
                  name="longDescription"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="Conductor's no"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder="Conductor's no"
                  onChange={(e) => this.setState({ _CNo: e.target.value })}
                  name="priority"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </div>
        </Dialog>
        <Dialog
          fullScreen
          open={this.state.editing}
          onClose={() => this.setState({ editing: false })}
          TransitionComponent={this.Transition}
        >
          <AppBar
            style={{
              position: "relative",
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => this.setState({ editing: false })}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography
                variant="h6"
                style={{
                  marginLeft: 8,
                  flex: 1,
                }}
              >
                Edit Bus
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={() => {
                  this.setState({ loading: true });
                  this.update_data();
                }}
              >
                {this.state.loading ? (
                  <CircularProgress
                    style={{ width: 40, height: 40, color: "#fff" }}
                  />
                ) : (
                  <div>Update</div>
                )}
              </Button>
            </Toolbar>
          </AppBar>
          <div style={{ flexGrow: 1, margin: 10 }}>
            <Grid container>
              <Grid item xs={6}>
                <TextField
                  id="outlined-full-width"
                  label="Type"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state.snap.name}
                  required
                  onChange={(e) => {
                    this.setState({
                      snap: {
                        ...this.state.snap,
                        name: e.target.value,
                      },
                    });
                  }}
                  name="name"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="Fair"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state.snap.fair}
                  onChange={(e) => {
                    this.setState({
                      snap: {
                        ...this.state.snap,
                        fair: e.target.value,
                      },
                    });
                  }}
                  name="website"
                  required
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />

                <TextField
                  id="outlined-full-width"
                  label="Start Time"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state.snap.start}
                  required
                  onChange={(e) => {
                    this.setState({
                      snap: {
                        ...this.state.snap,
                        start: e.target.value,
                      },
                    });
                  }}
                  name="email"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="End Time"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state.snap.end}
                  onChange={(e) => {
                    this.setState({
                      snap: {
                        ...this.state.snap,
                        end: e.target.value,
                      },
                    });
                  }}
                  name="phone"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="outlined-full-width"
                  label="Driver's name"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state.snap.dname}
                  onChange={(e) => {
                    this.setState({
                      snap: {
                        ...this.state.snap,
                        dname: e.target.value,
                      },
                    });
                  }}
                  name="address"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="Driver's no"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state.snap.dno}
                  onChange={(e) => {
                    this.setState({
                      snap: {
                        ...this.state.snap,
                        dno: e.target.value,
                      },
                    });
                  }}
                  name="shortDescription"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="Conductor's name"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state.snap.cname}
                  onChange={(e) =>
                    this.setState({
                      snap: {
                        ...this.state.snap,
                        cname: e.target.value,
                      },
                    })
                  }
                  name="longDescription"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="Conductor's no"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state.snap.cno}
                  onChange={(e) =>
                    this.setState({
                      snap: {
                        ...this.state.snap,
                        cno: e.target.value,
                      },
                    })
                  }
                  name="priority"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </div>
        </Dialog>
        <Dialog
          open={this.state._warning}
          onClose={() => this.setState({ _warning: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle style={{ color: "#f00" }} id="alert-dialog-title">
            {"Warning! Are you sure?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Once you delete the bus, then it will be permanently removed. This
              can not be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ _warning: false, _loading: false });
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              color="secondary"
              onClick={(e) => {
                this.setState({
                  _warning: false,
                  _loading: true,
                });
                this.delete_ad(e, this.state._UID);
              }}
            >
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.start}
        >
          <DialogTitle>Choose all the following.</DialogTitle>
          <DialogContent>
            <form
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              <NativeSelect
                style={{
                  marginTop: 2,
                  width: "100%",
                }}
                value={this.state._Start}
                name="_Start"
                onChange={(e) => {
                  this.setState({ _Start: e.target.value });
                  endList = [];
                  this.get_end_items(e.target.value);
                }}
                inputProps={{ "aria-label": "service" }}
              >
                <option value="" placeholder>
                  Choose Source
                </option>
                {startList.map((x) => (
                  <option value={x}>{x}</option>
                ))}
              </NativeSelect>
              <FormHelperText>
                Choose Source (Please wait if you see the list empty as data
                being loaded)
              </FormHelperText>

              <NativeSelect
                style={{
                  marginTop: 35,
                  width: "100%",
                }}
                value={this.state._End}
                name="_End"
                onChange={(e) => this.setState({ _End: e.target.value })}
                inputProps={{ "aria-label": "subService" }}
              >
                <option value="Choose Sub-Service" placeholder>
                  Choose Destination
                </option>
                {endList.map((x) => (
                  <option value={x}>{x}</option>
                ))}
              </NativeSelect>
              <FormHelperText>
                Choose Destination (Please wait if you see the list empty as
                data being loaded)
              </FormHelperText>
              {this.state._wrong ? (
                <Alert
                  variant="outlined"
                  severity="warning"
                  style={{ marginTop: 10 }}
                >
                  Please select all the items!
                </Alert>
              ) : (
                ""
              )}
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ start: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={this.get_bus} color="primary">
              {this.state._loading ? (
                <CircularProgress style={{ width: 20, height: 20 }} />
              ) : (
                <div>Ok</div>
              )}
            </Button>
          </DialogActions>
        </Dialog>
        {data === null || data === undefined || data.length === 0 ? (
          <div style={{ marginTop: 25 }}>Nothing here. Add new Buses</div>
        ) : (
          data.map(this.get_ad_table)
        )}
      </div>
    );
  }
}
