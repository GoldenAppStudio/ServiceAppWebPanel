import React, { Component } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import FormHelperText from "@material-ui/core/FormHelperText";
import NativeSelect from "@material-ui/core/NativeSelect";
import state from "./State";
import { storage } from "../../Firebase";
import firebase from "firebase";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

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
import Alert from "@material-ui/lab/Alert";
import ImageUploader from "react-images-upload";
import DialogContentText from "@material-ui/core/DialogContentText";

const database = firebase.database();
const ref = database.ref("service_list");
const db = database.ref();
var ssc;
var data = [];
var stateList = [];
for (var i = 0; i < 35; i++) {
  stateList = stateList.concat(state.states[i].state);
}

var mState, mDistrict, mService, mSubService;
var distList = [];

export default class ServiceProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _Name: "",
      _Email: "",
      _Address: "",
      _Description: "",
      _Phone: "",
      _Image: null,
      _name: "",
      _email: "",
      _address: "",
      _description: "",
      _phone: "",
      _image: null,
      open: false,
      count: 0,
      editing: false,
      start: true,
      progress: 0,
      _warning: false,
      serviceX: "",
      subServiceX: "",
      stateX: "",
      districtX: "",
      loading: false,
      service_uid: "",
      serviceList: [],
      subServiceList: [],
      SERVICE_UID: "",
      SUB_SERVICE_UID: "",
      SP_UID: "",
      data: [],
      _wrong: false,
      _loading: false,
      snap: {},
    };
    this.interval = setInterval(
      () => this.setState({ time: Date.now() }),
      1000
    );
    this.get_service_uid = this.get_service_uid.bind(this);
  }

  get_service_uid = () => {
    database
      .ref()
      .child("service_list")
      .once("value", (s) => {
        s.forEach((childSnapshot) => {
          if (
            childSnapshot.child("service_name").val() === this.state.serviceX
          ) {
            this.setState({ SERVICE_UID: childSnapshot.child("UID").val() });
            childSnapshot.child("sub_service").forEach((value) => {
              if (value.child("ss_name").val() === this.state.subServiceX) {
                this.setState({ SUB_SERVICE_UID: value.child("UID").val() });
                this.get_sp();
              }
            });
          }
        });
      });
  };

  async get_sp() {
    this.setState({ start: false });
    var dataSnapshot = await db.child("service_providers").once("value");

    dataSnapshot.forEach((snapshot) => {
      if (
        snapshot.child("service").val() === this.state.SERVICE_UID &&
        snapshot.child("sub_service").val() === this.state.SUB_SERVICE_UID &&
        snapshot.child("state").val() === this.state.stateX &&
        snapshot.child("district").val() === this.state.districtX
      ) {
        data.push(snapshot.val());
      }
    });
  }

  Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  move_next = () => {
    if (
      this.state.stateX === "" ||
      this.state.stateX === "Choose Service" ||
      this.state.districtX === "" ||
      this.state.districtX === "Choose District" ||
      this.state.serviceX === "" ||
      this.state.serviceX === "Choose Service" ||
      this.state.subServiceX === "" ||
      this.state.subServiceX === "Choose SUb-Service"
    ) {
      this.setState({ _wrong: true });
    } else {
      this.setState({
        start: false,
        _loading: true,
      });
      this.get_service_uid();
    }
  };

  async get_child_count() {
    await ref
      .child(mService)
      .child(mSubService)
      .child(mState)
      .child(mDistrict)
      .on("value", (snapshot) => {
        this.setState({ count: snapshot.numChildren() });
      });
  }

  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }

  async populate_service_list() {
    var ref2 = database.ref("service_list");
    await ref2.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (
          childSnapshot.child("service_name").val() !== "Travel" &&
          childSnapshot.child("sub_service").exists()
        ) {
          this.setState({
            serviceList: this.state.serviceList.concat([
              childSnapshot.child("service_name").val(),
            ]),
          });
        } else {
        }
      });
    });
  }

  async populate_sub_service_list(e) {
    var ref3 = database.ref("service_list");
    await ref3.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.child("service_name").val() === e) {
          childSnapshot.child("sub_service").forEach((snapshot) => {
            this.setState({
              subServiceList: this.state.subServiceList.concat([
                snapshot.child("ss_name").val(),
              ]),
            });
          });
        }
      });
    });
  }

  handleClick = () => {
    this.setState({ loading: true });
    this.upload_image();
  };

  handleClickEdit = () => {
    this.setState({ loading: true });
    this.update_data();
  };

  componentDidMount() {
    data = [];
    this.setState({ data: [] });
    this.populate_service_list();
  }

  update_data = () => {
    var mRef = database.ref();

    mRef
      .child("service_providers")
      .child(this.state.SP_UID)
      .update(
        {
          name: this.state._name.trim(),
          email: this.state._email.trim(),
          phone: "+91" + this.state._phone.trim(),
          address: this.state._address.trim(),
          description: this.state._description.trim(),
        },
        () => {
          if (this.state._image !== null) {
            const uploadTask = storage
              .child(`service_provider_images/${this.state.SP_UID}.jpg`)
              .put(this.state._image);
            uploadTask.on(
              "state_changed",
              (snapshot) => {},
              (error) => {
                console.log(error);
              },
              () => {
                // complete function ....
                this.setState({ open: false, loading: false });
              }
            );
          }
        }
      );
  };

  upload_image = () => {
    var mRef = database.ref();
    var pushRef = mRef.child("service_providers").push();
    pushRef.set(
      {
        name: this.state._Name.trim(),
        email: this.state._Email.trim(),
        phone: "+91" + this.state._Phone.trim(),
        address: this.state._Address.trim(),
        description: this.state._Description.trim(),
        state: this.state.stateX.trim(),
        district: this.state.districtX.trim(),
        service: this.state.SERVICE_UID.trim(),
        sub_service: this.state.SUB_SERVICE_UID.trim(),
        UID: pushRef.key.toString().trim(),
      },
      () => {
        if (this.state._Image !== null) {
          const uploadTask = storage
            .child(`service_provider_images/${pushRef.key.toString()}.jpg`)
            .put(this.state._Image);
          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              console.log(error);
            },
            () => {
              // complete function ....
              this.setState({ open: false, loading: false });
            }
          );
        }
      }
    );
  };

  upload_data = () => {
    ref
      .child(mService)
      .child(mSubService)
      .child(mState)
      .child(mDistrict)
      .child(this.state.count + 1)
      .child("name")
      .set(this.state.name);

    ref
      .child(mService)
      .child(mSubService)
      .child(mState)
      .child(mDistrict)
      .child(this.state.count + 1)
      .child("email")
      .set(this.state.email);

    ref
      .child(mService)
      .child(mSubService)
      .child(mState)
      .child(mDistrict)
      .child(this.state.count + 1)
      .child("address")
      .set(this.state.address);

    ref
      .child(mService)
      .child(mSubService)
      .child(mState)
      .child(mDistrict)
      .child(this.state.count + 1)
      .child("description")
      .set(this.state.longDescription);

    ref
      .child(mService)
      .child(mSubService)
      .child(mState)
      .child(mDistrict)
      .child(this.state.count + 1)
      .child("state")
      .set(mState);

    ref
      .child(mService)
      .child(mSubService)
      .child(mState)
      .child(mDistrict)
      .child(this.state.count + 1)
      .child("district")
      .set(mDistrict);

    ref
      .child(mService)
      .child(mSubService)
      .child(mState)
      .child(mDistrict)
      .child(this.state.count + 1)
      .child("service")
      .set(mService);

    ref
      .child(mService)
      .child(mSubService)
      .child(mState)
      .child(mDistrict)
      .child(this.state.count + 1)
      .child("sub")
      .set(mSubService);

    ref
      .child(mService)
      .child(mSubService)
      .child(mState)
      .child(mDistrict)
      .child(this.state.count + 1)
      .child("uid")
      .set(`${this.state.count + 1}`);

    ref
      .child(mService)
      .child(mSubService)
      .child(mState)
      .child(mDistrict)
      .child(this.state.count + 1)
      .child("priority")
      .set(this.state.priority);

    ref
      .child(mService)
      .child(mSubService)
      .child(mState)
      .child(mDistrict)
      .child(this.state.count + 1)
      .child("price")
      .set(this.state.price);

    ref
      .child(mService)
      .child(mSubService)
      .child(mState)
      .child(mDistrict)
      .child(this.state.count + 1)
      .child("phone")
      .set(this.state.phone);

    alert("Data added");
  };

  fetch_images = (UID) => {
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var image_url;
    storageRef
      .child("service_provider_images")
      .child(UID + ".jpg")
      .getDownloadURL()
      .then((url) => {
        image_url = url;
        this.setState({ url: url });
        console.log(this.state.url);
      });

    return image_url;
  };

  get_sp_table = (snapshot) => {
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
            <Typography>{mService}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{mSubService}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{mState}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{mDistrict}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.phone}</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div style={{ flexBasis: "10%" }}>
            {this.fetch_images(snapshot.UID)}
            <img
              style={{ width: 50, height: 50 }}
              src={this.state.url}
              alt=""
              className="img-fluid"
            />
          </div>
          <div style={{ flexBasis: "90%" }}>
            <Typography>{snapshot.description}</Typography>
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button
            onClick={(e) => {
              this.setState({
                editing: true,
                SP_UID: snapshot.UID,
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
              this.setState({ _warning: true, SP_UID: snapshot.UID });
            }}
            variant="outlined"
            color="secondary"
          >
            Delete
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  };

  delete_sp = (e, UID) => {
    db.child("service_providers").child(UID).remove();
    window.location.reload();
    alert("Service Provider deleted");
  };

  cancel = () => {
    this.setState({ start: false });
  };

  handleChange = () => (event) => {
    this.setState({
      ...this.state,
      serviceX: event.target.value,
      serviceCount: event.target.selectedIndex + 1,
      subServiceList: [],
    });
    mService = event.target.value;
    this.populate_sub_service_list(event.target.value);
  };

  get_index = () => (event) => {
    this.setState({
      ...this.state,
      subServiceX: event.target.value,
      subServiceCount: event.target.selectedIndex,
    });
    ssc = event.target.selectedIndex;
    mSubService = event.target.value;
  };

  get_district = () => (event) => {
    this.setState({
      ...this.state,
      stateX: event.target.value,
    });
    mState = event.target.value;
    var abc = stateList.indexOf(event.target.value);
    distList = state.states[abc].districts;
  };

  handleDistrict = () => (event) => {
    this.setState({
      districtX: event.target.value,
    });
    mDistrict = event.target.value;
  };

  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>Service Providers</h1>
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
              <Typography>Service</Typography>
            </div>
            <div style={{ flexBasis: "33.33%" }}>
              <Typography>Sub-Service</Typography>
            </div>
            <div style={{ flexBasis: "33.33%" }}>
              <Typography>State</Typography>
            </div>
            <div style={{ flexBasis: "33.33%" }}>
              <Typography>District</Typography>
            </div>
            <div style={{ flexBasis: "33.33%" }}>
              <Typography>Phone</Typography>
            </div>
          </ExpansionPanelSummary>
        </ExpansionPanel>
        <Fab
          onClick={this.handleClickOpen}
          color="primary"
          aria-label="add"
          style={{ right: 35, position: "fixed", bottom: 35 }}
        >
          <AddIcon />
        </Fab>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
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
                onClick={this.handleClose}
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
                Add New Service Provider
              </Typography>
              <Button autoFocus color="inherit" onClick={this.handleClick}>
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
          <div style={{ flexGrow: 1, margin: 15 }}>
            <Grid container>
              <Grid item xs={6}>
                <ImageUploader
                  fileContainerStyle={{ backgroundColor: "#ddd" }}
                  withIcon={true}
                  buttonStyles={{ backgroundColor: "#c55" }}
                  withPreview
                  style={{ width: 500 }}
                  singleImage={true}
                  buttonText="Choose image *"
                  onChange={(pic) => this.setState({ _Image: pic[0] })}
                  imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                  maxFileSize={5242880}
                />

                <TextField
                  id="outlined-full-width"
                  label="Name"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder=""
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
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="outlined-full-width"
                  label="Email"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder=""
                  required
                  onChange={(e) => {
                    this.setState({ _Email: e.target.value });
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
                  label="Address"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder=""
                  required
                  onChange={(e) => {
                    this.setState({ _Address: e.target.value });
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
                  label="Description"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder=""
                  required
                  onChange={(e) => {
                    this.setState({ _Description: e.target.value });
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
                  label="Phone"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder=""
                  required
                  onChange={(e) => {
                    this.setState({ _Phone: e.target.value });
                  }}
                  name="phone"
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
          onClose={() => {
            this.setState({ _warning: false });
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle style={{ color: "#f00" }} id="alert-dialog-title">
            {"Warning! Are you sure?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Once you delete the sub-service, then its service providers will
              also be permanently removed. This can not be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ _warning: false });
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={(e) => {
                this.delete_sp(e, this.state.SP_UID);
              }}
              color="secondary"
              autoFocus
            >
              Proceed
            </Button>
          </DialogActions>
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
                Edit Service Provider
              </Typography>
              <Button autoFocus color="inherit" onClick={this.handleClickEdit}>
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
          <div style={{ flexGrow: 1, margin: 15 }}>
            <Grid container>
              <Grid item xs={6}>
                <ImageUploader
                  fileContainerStyle={{ backgroundColor: "#ddd" }}
                  withIcon={true}
                  buttonStyles={{ backgroundColor: "#c55" }}
                  withPreview
                  style={{ width: 500 }}
                  singleImage={true}
                  buttonText="Choose image *"
                  onChange={(pic) => this.setState({ _image: pic[0] })}
                  imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                  maxFileSize={5242880}
                />

                <TextField
                  id="outlined-full-width"
                  label="Name"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state.snap.name}
                  required
                  onChange={(e) => {
                    this.setState({ _name: e.target.value });
                  }}
                  name="name"
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
                  label="Email"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state.snap.email}
                  required
                  onChange={(e) => {
                    this.setState({ _email: e.target.value });
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
                  label="Address"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state.snap.address}
                  required
                  onChange={(e) => {
                    this.setState({ _address: e.target.value });
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
                  label="Description"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state.snap.description}
                  required
                  onChange={(e) => {
                    this.setState({ _description: e.target.value });
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
                  label="Phone"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state.snap.phone}
                  required
                  onChange={(e) => {
                    this.setState({ _phone: e.target.value });
                  }}
                  name="phone"
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
                value={this.state.serviceX}
                name="service"
                onChange={this.handleChange("service")}
                inputProps={{ "aria-label": "service" }}
              >
                <option value="" placeholder>
                  Choose Service
                </option>
                {this.state.serviceList.map((x) => (
                  <option value={x}>{x}</option>
                ))}
              </NativeSelect>
              <FormHelperText>
                Choose Service (Please wait if you see the list empty as data
                being loaded)
              </FormHelperText>

              <NativeSelect
                style={{
                  marginTop: 35,
                  width: "100%",
                }}
                value={this.state.subServiceX}
                name="subService"
                onChange={this.get_index("subService")}
                inputProps={{ "aria-label": "subService" }}
              >
                <option value="Choose Sub-Service" placeholder>
                  Choose Sub-Service
                </option>
                {this.state.subServiceList.map((x) => (
                  <option value={x}>{x}</option>
                ))}
              </NativeSelect>
              <FormHelperText>
                Choose Sub-Service (Please wait if you see the list empty as
                data being loaded)
              </FormHelperText>
              <NativeSelect
                style={{
                  marginTop: 35,
                  width: "100%",
                }}
                value={this.state.stateX}
                name="state"
                onChange={this.get_district("subService")}
                inputProps={{ "aria-label": "subService" }}
              >
                <option value="Choose State" placeholder>
                  Choose State
                </option>
                {stateList.map((x) => (
                  <option value={x}>{x}</option>
                ))}
              </NativeSelect>
              <FormHelperText>
                Choose State (Please wait if you see the list empty as data
                being loaded)
              </FormHelperText>
              <NativeSelect
                style={{
                  marginTop: 35,
                  width: "100%",
                }}
                value={this.state.districtX}
                name="district"
                onChange={this.handleDistrict("district")}
                inputProps={{ "aria-label": "subService" }}
              >
                <option value="Choose District" placeholder>
                  Choose District
                </option>
                {distList.map((x) => (
                  <option value={x}>{x}</option>
                ))}
              </NativeSelect>
              <FormHelperText>
                Choose District (Please wait if you see the list empty as data
                being loaded)
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
            <Button onClick={this.cancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.move_next} color="primary">
              {this.state._loading ? (
                <CircularProgress style={{ width: 20, height: 20 }} />
              ) : (
                <div>Ok</div>
              )}
            </Button>
          </DialogActions>
        </Dialog>
        {data === null || data === undefined || data.length === 0 ? (
          <div style={{ marginTop: 25 }}>
            Nothing here. Add new Service providers
          </div>
        ) : (
          // data.map()
          data.map(this.get_sp_table)
        )}
      </div>
    );
  }
}
