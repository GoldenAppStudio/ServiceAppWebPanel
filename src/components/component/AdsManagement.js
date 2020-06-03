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

const database = firebase.database();
const ref = database.ref("ShowAd");
var storageRef = firebase.storage().ref();
var data = [];
var generated_id = Date.now();

export default class AdsManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      count: 0,
      scroll: "paper",
      editing: false,
      name: "",
      shortDescription: "",
      longDescription: "",
      phone: "",
      email: "",
      address: "",
      priority: 0,
      website: "",
      image: "",
      loading: false,
      _name: "",
      _email: "",
      _phone: "",
      _shortDescription: "",
      _longDescription: "",
      _address: "",
      _priority: 0,
      _website: "",
      _image: null,
      UID: "",
      url: "",
      snap: "",
      snapshot_id: "",
      _warning: false,
      _loading: false,
      showImage: "",
      id: "",
    };
    this.interval = setInterval(
      () => this.setState({ time: Date.now() }),
      1000
    );
  }

  async get_ads() {
    var dataSnapshot = await ref.once("value");
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

  upload_image = () => {
    if (
      this.state.image == null ||
      this.state.name === "" ||
      this.state.longDescription === "" ||
      this.state.shortDescription === "" ||
      this.state.priority === "" ||
      this.state.email === ""
    ) {
      alert("Please add all required field!");
      this.setState({ loading: false });
    } else {
      const uploadTask = storage
        .child(`ads_images/${generated_id}.jpg`)
        .put(this.state.image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progrss function ....
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        (error) => {
          // error function ....
          console.log(error);
        },
        () => {
          // complete function ....
          this.upload_ad_data();
        }
      );
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
      .set(generated_id);
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
      for (var i = 0; i < loopCount; i++) {
        var newData = await this.return_data(i, id);
        setTimeout(() => {}, 6);
        ref.child(`${id + i}`).set(newData);
        ref
          .child(`${id + i}`)
          .child("UID")
          .set(parseInt(id + i));
      }
    }
    ref.child(this.state.count).remove();
    setTimeout(() => {}, 3);
    this.setState({ loading: false });
    window.location.reload();
    alert("In-App Ad removed from database.");
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
          <div style={{ marginLeft: 5 }}>
            <Typography>{snapshot.longDisc}</Typography>
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button
            onClick={() => {
              this.setState({ editing: true });
              this.setState({
                _name: snapshot.name,
                _email: snapshot.email,
                _phone: snapshot.phone,
                _shortDescription: snapshot.shortDisc,
                _longDescription: snapshot.longDisc,
                _website: snapshot.website,
                _priority: snapshot.priority,
                _address: snapshot.address,
                UID: snapshot.UID,
                id: snapshot.id,
                snapshot: snapshot,
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
                UID: snapshot.UID,
                snapshot_id: snapshot.id,
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
    if (this.state._image !== null) {
      const uploadTask = storage
        .child(`ads_images/${this.state.id}.jpg`)
        .put(this.state._image);
      console.log(this.state.id + " + 000");
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progrss function ....
        },
        (error) => {
          // error function ....
          console.log(error);
        },
        () => {
          // complete function ....
          ref.child(this.state.UID).child("name").set(this.state._name.trim());
          ref
            .child(this.state.UID)
            .child("email")
            .set(this.state._email.trim());
          ref
            .child(this.state.UID)
            .child("phone")
            .set(this.state._phone.trim());
          if (this.state._priority !== "") {
            ref
              .child(this.state.UID)
              .child("priority")
              .set(parseInt(this.state._priority));
          }

          ref
            .child(this.state.UID)
            .child("address")
            .set(this.state._address.trim());
          ref
            .child(this.state.UID)
            .child("shortDisc")
            .set(this.state._shortDescription.trim());
          ref
            .child(this.state.UID)
            .child("longDisc")
            .set(this.state._longDescription.trim());
          ref.child(this.state.UID).child("website").set(this.state._website);
          this.setState({ loading: false, editing: false });
          // window.location.reload();
          alert("In-App Ad updated in database.");
        }
      );
    } else {
      ref.child(this.state.UID).child("name").set(this.state._name.trim());
      ref.child(this.state.UID).child("email").set(this.state._email.trim());
      ref.child(this.state.UID).child("phone").set(this.state._phone.trim());
      if (this.state._priority !== "") {
        ref
          .child(this.state.UID)
          .child("priority")
          .set(parseInt(this.state._priority));
      }

      ref
        .child(this.state.UID)
        .child("address")
        .set(this.state._address.trim());
      ref
        .child(this.state.UID)
        .child("shortDisc")
        .set(this.state._shortDescription.trim());
      ref
        .child(this.state.UID)
        .child("longDisc")
        .set(this.state._longDescription.trim());
      ref.child(this.state.UID).child("website").set(this.state._website);
      this.setState({ loading: false, editing: false });
      // window.location.reload();
      alert("In-App Ad updated in database.");
    }
  };

  componentDidMount() {
    this.get_child_count();
    this.get_ads();
    //this.set_image(3);
  }

  fetch_images = (id) => {
    var storage = firebase.storage();
    var storageRef = storage.ref();
    storageRef
      .child("ads_images")
      .child(id + ".jpg")
      .getDownloadURL()
      .then((url) => {
        this.setState({ url: url });
      });
  };

  render() {
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
          onClick={() => this.setState({ open: true })}
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
                Serve new In-App Ad
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={() => {
                  this.setState({ loading: true });
                  this.upload_image();
                }}
              >
                {this.state.loading ? (
                  <CircularProgress
                    style={{ width: 40, height: 40, color: "#fff" }}
                  />
                ) : (
                  <div>Serve</div>
                )}
              </Button>
            </Toolbar>
          </AppBar>
          <div style={{ flexGrow: 1, margin: 10 }}>
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
                  onChange={(pic) => this.setState({ image: pic[0] })}
                  imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                  maxFileSize={5242880}
                />
                <TextField
                  id="outlined-full-width"
                  label="Name of Company"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder="Name of Company"
                  required
                  onChange={(e) => {
                    this.setState({ name: e.target.value });
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
                  label="Email"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder="Email"
                  required
                  onChange={(e) => {
                    this.setState({ email: e.target.value });
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
                  label="Phone"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder="Phone"
                  onChange={(e) => {
                    this.setState({ phone: e.target.value });
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
                  label="Website"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder="Website"
                  onChange={(e) => {
                    this.setState({ website: e.target.value });
                  }}
                  name="website"
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
                  placeholder="Address"
                  onChange={(e) => {
                    this.setState({ address: e.target.value });
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
                  label="Short Description"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder="Short Description"
                  required
                  onChange={(e) => {
                    this.setState({ shortDescription: e.target.value });
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
                  label="Long Description"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder="Long Description"
                  required
                  onChange={(e) =>
                    this.setState({ longDescription: e.target.value })
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
                  label="Priority"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder="Priority"
                  required
                  onChange={(e) => this.setState({ priority: e.target.value })}
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
          {this.fetch_images(this.state.id)}
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
                Edit In-App Ad
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
                  <div>Save</div>
                )}
              </Button>
            </Toolbar>
          </AppBar>
          <div style={{ flexGrow: 1, margin: 10 }}>
            <Grid container>
              <Grid item xs={6}>
                <img
                  style={{ width: 100, height: 100, marginLeft: "30%" }}
                  alt=""
                  src={this.state.url}
                  className="img-fluid"
                />
                <ImageUploader
                  fileContainerStyle={{ backgroundColor: "#ddd" }}
                  withIcon={true}
                  buttonStyles={{ backgroundColor: "#c55" }}
                  withPreview
                  style={{ width: 500 }}
                  singleImage={true}
                  buttonText="Choose image"
                  onChange={(pic) => this.setState({ _image: pic[0] })}
                  imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                  maxFileSize={5242880}
                />
                <TextField
                  id="outlined-full-width"
                  label="Name of Company"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state._name}
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
                <TextField
                  id="outlined-full-width"
                  label="Email"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state._email}
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
                  label="Phone"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state._phone}
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
              <Grid item xs={6}>
                <TextField
                  id="outlined-full-width"
                  label="Website"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state._website}
                  required
                  onChange={(e) => {
                    this.setState({ _website: e.target.value });
                  }}
                  name="website"
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
                  placeholder={this.state._address}
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
                  label="Short Description"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state._shortDescription}
                  required
                  onChange={(e) => {
                    this.setState({ _shortDescription: e.target.value });
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
                  label="Long Description"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state._longDescription}
                  required
                  onChange={(e) =>
                    this.setState({ _longDescription: e.target.value })
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
                  label="Priority"
                  style={{ marginTop: 23, width: 500 }}
                  placeholder={this.state._priority}
                  required
                  onChange={(e) => this.setState({ _priority: e.target.value })}
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
              Once you delete the service, then its sub-services and service
              providers will also be permanently removed. This can not be
              undone.
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
                this.delete_ad(e, this.state.UID);
              }}
            >
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
        {data === null || data === undefined || data.length === 0 ? (
          <div></div>
        ) : (
          data.map(this.get_ad_table)
        )}
      </div>
    );
  }
}
