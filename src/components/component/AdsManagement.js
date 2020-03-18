import React, { Component } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import { storage } from "../../Firebase";
import firebase from "firebase";

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
const ref = database.ref("ShowAd");
var data = [];

export default class AdsManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      count: 0,
      progress: 0,
      name: "",
      shortDescription: "",
      longDescription: "",
      phone: "",
      adList: null,
      email: "",
      address: "",
      priority: 0,
      website: ""
    };
    this.interval = setInterval(
      () => this.setState({ time: Date.now() }),
      1000
    );
  }

  async get_ads() {
    var dataSnapshot = await ref.once("value");
    data = dataSnapshot.val();
    console.log(data);
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

  async get_child_count() {
    await ref.once("value", snapshot => {
      this.setState({ count: snapshot.numChildren() });
    });
  }

  handleClick = () => {
    this.upload_image();
  };

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

  async upload_ad_data() {
    ref
      .child(this.state.count + 1)
      .child("name")
      .set(this.state.name);
    ref
      .child(this.state.count + 1)
      .child("address")
      .set(this.state.address);
    ref
      .child(this.state.count + 1)
      .child("email")
      .set(this.state.email);
    ref
      .child(this.state.count + 1)
      .child("phone")
      .set(this.state.phone);
    ref
      .child(this.state.count + 1)
      .child("priority")
      .set(parseInt(this.state.priority));
    ref
      .child(this.state.count + 1)
      .child("shortDisc")
      .set(this.state.shortDescription);
    ref
      .child(this.state.count + 1)
      .child("longDisc")
      .set(this.state.longDescription);
    ref
      .child(this.state.count + 1)
      .child("id")
      .set(this.state.count + 1);
    ref
      .child(this.state.count + 1)
      .child("website")
      .set(this.state.website);
  }

  edit_ad = snapshot => (event, expanded) => {
    this.get_total_count(snapshot);
  };

  delete_ad = (e, snapshot) => {
    console.log(snapshot);
    ref.child(snapshot).remove();
    this.adjust_database(snapshot);
  };

  async return_data(i, id) {
    var dataSnapshotVal;
    var ref2 = database.ref("ShowAd").child(`${id + 1 + i}`);

    try {
      dataSnapshotVal = await ref2.once("value");
      return dataSnapshotVal.val();
    } catch (error) {}
    return dataSnapshotVal;
  }

  async adjust_database(id) {
    if (id < this.state.count) {
      var loopCount = this.state.count - id;
      console.log(loopCount + " loopCount");
      for (var i = 0; i < loopCount; i++) {
        var newData = await this.return_data(i, id);
        setTimeout(() => {}, 6);
        ref.child(`${id + i}`).set(newData);
      }
    }
    ref.child(this.state.count).remove();
    setTimeout(() => {}, 3);
    window.location.reload();
    alert("Sub-Service removed from database.");
  }

  get_ad_table = snapshot => {
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
            <Typography>{snapshot.phone}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.email}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.website}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.priority}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.address}</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <Typography>{snapshot.longDisc}</Typography>
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button
            onClick={e => {
              this.delete_ad(e, snapshot.id);
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

  componentDidMount() {
    this.get_child_count();
    this.get_ads();
  }
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
        <h2 style={{ textAlign: "center" }}>In-App Ads</h2>
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
              <Typography>Phone</Typography>
            </div>
            <div style={{ flexBasis: "33.33%" }}>
              <Typography>Email</Typography>
            </div>
            <div style={{ flexBasis: "33.33%" }}>
              <Typography>Website</Typography>
            </div>
            <div style={{ flexBasis: "33.33%" }}>
              <Typography>Priority</Typography>
            </div>
            <div style={{ flexBasis: "33.33%" }}>
              <Typography>Address</Typography>
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
        {data === null || data === undefined || data.length == 0 ? (
          <div></div>
        ) : (
          data.map(this.get_ad_table)
        )}
      </div>
    );
  }
}
