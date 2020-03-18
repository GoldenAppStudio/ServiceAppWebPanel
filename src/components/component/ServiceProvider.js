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
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
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

const database = firebase.database();
const ref = database.ref("Service");
var ssc;
var stateList = [];
for (var i = 0; i < 35; i++) {
  var stateList = stateList.concat(state.states[i].state);
}
var mState, mDistrict, mService, mSubService;
var distList = [];
export default class ServiceProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      count: 0,
      start: true,
      progress: 0,
      serviceX: "",
      subServiceX: "",
      stateX: "",
      districtX: "",
      name: "",
      shortDescription: "",
      longDescription: "",
      phone: "",
      adList: null,
      email: "",
      address: "",
      priority: 0,
      website: "",
      serviceList: [],
      subServiceList: [],
      data: []
    };
    this.interval = setInterval(
      () => this.setState({ time: Date.now() }),
      1000
    );
  }

  async get_sp() {
    var dataSnapshot = await ref
      .child(mService)
      .child(mSubService)
      .child(mState)
      .child(mDistrict)
      .once("value");
    this.setState({ data: dataSnapshot.val() });
    console.log(this.state.data);
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
    this.setState({
      start: false
    });
    this.get_sp();
  };

  async get_child_count() {
    await ref
      .child(mService)
      .child(mSubService)
      .child(mState)
      .child(mDistrict)
      .once("value", snapshot => {
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
        imagePreviewUrl: reader.result
      });
    };

    reader.readAsDataURL(file);
  }

  async populate_service_list() {
    var ref2 = database.ref("ServiceList");
    await ref2.once("value", snapshot => {
      snapshot.forEach(childSnapshot => {
        if (childSnapshot.child("service").val() === "Travel") {
        } else {
          this.setState({
            serviceList: this.state.serviceList.concat([
              childSnapshot.child("service").val()
            ])
          });
        }
      });
    });
    console.log(this.state.serviceList);
  }

  async populate_sub_service_list(e) {
    var ref3 = database.ref("ServiceList");
    await ref3
      .child(e)
      .child("subService")
      .once("value", snapshot => {
        snapshot.forEach(childSnapshot => {
          this.setState({
            subServiceList: this.state.subServiceList.concat([
              childSnapshot.child("name").val()
            ])
          });
        });
      });
  }

  handleClick = () => {
    this.upload_image();
  };

  componentDidMount() {
    this.populate_service_list();
  }

  upload_image = () => {
    const uploadTask = storage
      .child(`ads_images/${this.state.count + 1}.jpg`)
      .put(this.state.file);
    uploadTask.on(
      "state_changed",
      snapshot => {
        // progrss function ....
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      error => {
        // error function ....
        console.log(error);
      },
      () => {
        // complete function ....
        console.log("count: " + this.state.count);
        this.upload_ad_data();
        alert("Ad Published.");
      }
    );
  };

  get_sp_table = snapshot => {
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
          <div>
            <Typography>{snapshot.description}</Typography>
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button
            /*   onClick={e => {
              this.delete_sp(e, snapshot.id);
            }} */
            variant="outlined"
            color="secondary"
          >
            Delete
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  };

  handleChange = service => event => {
    this.setState({
      ...this.state,
      serviceX: event.target.value,
      serviceCount: event.target.selectedIndex + 1,
      subServiceList: []
    });
    mService = event.target.value;
    this.populate_sub_service_list(event.target.selectedIndex + 1);
  };

  get_index = subService => event => {
    this.setState({
      ...this.state,
      subServiceX: event.target.value,
      subServiceCount: event.target.selectedIndex
    });
    ssc = event.target.selectedIndex;
    mSubService = event.target.value;
  };

  get_district = stateX => event => {
    this.setState({
      ...this.state,
      stateX: event.target.value
    });
    mState = event.target.value;
    var abc = stateList.indexOf(event.target.value);
    distList = state.states[abc].districts;
  };

  handleDistrict = districtX => event => {
    this.setState({
      districtX: event.target.value
    });
    mDistrict = event.target.value;
    console.log(mService);
    console.log(mSubService);
    console.log(mState);
    console.log(mDistrict);
  };

  render() {
    const fileInputStyle = {
      borderBottom: "4px solid lightgray",
      borderRight: "4px solid lightgray",
      borderTop: "1px solid black",
      borderLeft: "1px solid black",
      marginTop: 20,
      padding: 10,
      width: 375,
      cursor: "pointer"
    };

    const imagePreviewStyle = {
      textAlign: "center",
      margin: "5px 15px",
      height: 123,
      width: 150,
      marginTop: 20,
      marginLeft: 35,
      borderLeft: "1px solid gray",
      borderRight: "1px solid gray",
      borderTop: "5px solid gray",
      borderBottom: "5px solid gray"
    };

    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;

    if (imagePreviewUrl) {
      $imagePreview = (
        <img
          src={imagePreviewUrl}
          style={{
            height: 123,
            width: 150,
            textAlign: "center",
            marginTop: 25
          }}
        />
      );
    } else {
      $imagePreview = (
        <div className="previewText">Please select an Image for Preview</div>
      );
    }

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
          //     onClick={this.handleClickOpen}
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
              position: "relative"
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
                  flex: 1
                }}
              >
                Serve new In-App Ad
              </Typography>
              <Button autoFocus color="inherit" onClick={this.handleClick}>
                Serve
              </Button>
            </Toolbar>
          </AppBar>
          <div style={{ flexGrow: 1, margin: 15 }}>
            <progress
              value={this.state.progress}
              max="100"
              style={{ width: "100%" }}
            />

            <Grid container>
              <Grid item xs={6}>
                <input
                  className="fileInput"
                  type="file"
                  style={fileInputStyle}
                  onChange={e => this.handleImageChange(e)}
                />
                <TextField
                  id="outlined-full-width"
                  label="Name of Company"
                  style={{ marginTop: 23, width: 400 }}
                  placeholder="Name of Company"
                  required
                  onChange={e => {
                    this.setState({ name: e.target.value });
                  }}
                  name="name"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="Email"
                  style={{ marginTop: 23, width: 400 }}
                  placeholder="Email"
                  required
                  onChange={e => {
                    this.setState({ email: e.target.value });
                  }}
                  name="email"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="Phone"
                  style={{ marginTop: 23, width: 400 }}
                  placeholder="Phone"
                  required
                  onChange={e => {
                    this.setState({ phone: e.target.value });
                  }}
                  name="phone"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="Website"
                  style={{ marginTop: 23, width: 400 }}
                  placeholder="Website"
                  required
                  onChange={e => {
                    this.setState({ website: e.target.value });
                  }}
                  name="website"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="Address"
                  style={{ marginTop: 23, width: 400 }}
                  placeholder="Address"
                  required
                  onChange={e => {
                    this.setState({ address: e.target.value });
                  }}
                  name="address"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <div className="imgPreview" style={imagePreviewStyle}>
                  {$imagePreview}
                </div>
                <TextField
                  id="outlined-full-width"
                  label="Short Description"
                  style={{ marginTop: 23, width: "100%" }}
                  placeholder="Short Description"
                  required
                  onChange={e => {
                    this.setState({ shortDescription: e.target.value });
                  }}
                  name="shortDescription"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="Long Description"
                  style={{ marginTop: 23, width: "100%" }}
                  placeholder="Long Description"
                  required
                  onChange={e => {
                    this.setState({ longDescription: e.target.value });
                  }}
                  name="longDescription"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="Priority"
                  style={{ marginTop: 23, width: "100%" }}
                  placeholder="Priority"
                  required
                  onChange={e => {
                    this.setState({ priority: e.target.value });
                  }}
                  name="priority"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
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
                flexWrap: "wrap"
              }}
            >
              <NativeSelect
                style={{
                  marginTop: 2,
                  width: "100%"
                }}
                value={this.state.serviceX}
                name="service"
                onChange={this.handleChange("service")}
                inputProps={{ "aria-label": "service" }}
              >
                <option value="" placeholder>
                  Choose Service
                </option>
                {this.state.serviceList.map(x => (
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
                  width: "100%"
                }}
                value={this.state.subServiceX}
                name="subService"
                onChange={this.get_index("subService")}
                inputProps={{ "aria-label": "subService" }}
              >
                <option value="Choose Sub-Service" placeholder>
                  Choose Sub-Service
                </option>
                {this.state.subServiceList.map(x => (
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
                  width: "100%"
                }}
                value={this.state.stateX}
                name="state"
                onChange={this.get_district("subService")}
                inputProps={{ "aria-label": "subService" }}
              >
                <option value="Choose State" placeholder>
                  Choose State
                </option>
                {stateList.map(x => (
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
                  width: "100%"
                }}
                value={this.state.districtX}
                name="district"
                onChange={this.handleDistrict("district")}
                inputProps={{ "aria-label": "subService" }}
              >
                <option value="Choose District" placeholder>
                  Choose District
                </option>
                {distList.map(x => (
                  <option value={x}>{x}</option>
                ))}
              </NativeSelect>
              <FormHelperText>
                Choose District (Please wait if you see the list empty as data
                being loaded)
              </FormHelperText>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.move_next} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        {this.state.data === null ||
        this.state.data === undefined ||
        this.state.data.length == 0 ? (
          <div></div>
        ) : (
          this.state.data.map(this.get_sp_table)
        )}
      </div>
    );
  }
}
