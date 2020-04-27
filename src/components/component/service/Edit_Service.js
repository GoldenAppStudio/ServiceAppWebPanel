import React, { Component } from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import NativeSelect from "@material-ui/core/NativeSelect";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import Delete from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { storage } from "../../../Firebase";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const database = firebase.database();
const ref = database.ref("ServiceList");
const db = database.ref("Service");
var mServiceCount;

var test;
var storageRef = firebase.storage().ref();
storageRef
  .child("ads_images/1.jpg")
  .getDownloadURL()
  .then(function (url) {
    test = url;
  })
  .catch(function () {});

export default class Edit_Service extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      file: "",
      imagePreviewUrl: "",
      url: "",
      open: false,
      progress: 0,
      serviceName: "",
      count: null,
      isCountAvailable: false,
      labelWidth: 0,
      service: "",
      dataSnapshot: null,
      serviceCount: 0,
      serviceList: [],
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
    this.return_data(0);
  };

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

  upload_image = () => {
    const uploadTask = storage
      .child(`service/${this.state.serviceName.trim()}.jpg`)
      .put(this.state.file);
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
      }
    );
  };

  updateInput = (event) => {
    this.setState({ serviceName: event.target.value });
  };

  handleClose = () => {
    this.setState({ open: false });
    /* this.return_data(0);
    this.update_service();
    this.delete_service(); */
    db.child(this.state.service).once("value", (snapshot) => {
      db.child(this.state.serviceName).set(snapshot.val());
    });
    alert(this.state.serviceCount);
    ref
      .child(this.state.serviceCount + 1)
      .child("service")
      .set(this.state.serviceName);
    this.upload_image();

    alert("Data successfully updated");
    // window.location.reload();
  };

  async populate_service_list() {
    await ref.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        this.setState({
          serviceList: this.state.serviceList.concat([
            childSnapshot.child("service").val(),
          ]),
        });
      });
    });
  }

  async get_child_count() {
    var childCount;
    await ref.once("value", (snapshot) => {
      this.setState({ count: snapshot.numChildren() });
      childCount = snapshot.numChildren();
    });
    return childCount;
  }

  handleChange = (service) => (event) => {
    this.setState({
      ...this.state,
      [service]: event.target.value,
      serviceCount: event.target.selectedIndex,
    });
    mServiceCount = event.target.selectedIndex + 1;
    console.log(mServiceCount);
    storageRef
      .child(`service/${event.target.value}.jpg`)
      .getDownloadURL()
      .then(function (url) {
        test = url;
      })
      .catch(function () {});
  };

  async return_data(i) {
    /*  var dataSnapshotVal;
    var ref2 = database.ref("ServiceList").child(`${mServiceCount + 1 + i}`);
    try {
      dataSnapshotVal = await ref2.once("value");
      return dataSnapshotVal.val();
    } catch (error) {}
    return dataSnapshotVal; */
  }

  delete_service = () => {
    /*  console.log(mServiceCount);

    ref.child(`${mServiceCount}`).remove(); */
  };

  async adjust_database() {
    /* if (mServiceCount < this.state.count) {
      var loopCount = this.state.count - mServiceCount;
      console.log(loopCount + " loopCount");
      console.log(this.state.count + " count");
      for (var i = 0; i < loopCount; i++) {
        var newData = await this.return_data(i);
        setTimeout(() => {}, 6);
        ref.child(`${mServiceCount + i}`).set(newData);
      }
    }
    ref.child(`${this.state.count}`).remove();

    setTimeout(() => {}, 3);
    window.location.reload();
    alert("Service removed from database."); */
  }

  handleDelete = () => {
    this.handleClickOpen();
    this.setState({ serviceList: [] });
    this.populate_service_list();
    this.get_child_count();
  };

  componentDidMount() {
    this.populate_service_list();
    this.get_child_count();
  }

  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;

    if (imagePreviewUrl) {
      $imagePreview = (
        <img
          alt=""
          src={imagePreviewUrl}
          style={{
            height: 123,
            width: 150,
            textAlign: "center",
            marginTop: 25,
          }}
        />
      );
    } else {
      $imagePreview = (
        <div className="previewText">
          Please select new Image for Preview (to snyc with new new name please
          choose new image)
        </div>
      );
    }

    return (
      <div className="container">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <div style={{ width: "100%" }}>
              <img
                src={this.state.image == null ? test : this.state.image}
                style={{
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "50%",
                  borderRadius: "50%",
                  width: 75,
                  height: 70,
                }}
                alt="Avatar"
              />
              <NativeSelect
                style={{
                  marginTop: 2,
                  width: "100%",
                }}
                value={this.state.service}
                name="service"
                onChange={this.handleChange("service")}
                inputProps={{ "aria-label": "service" }}
              >
                {this.state.serviceList.map((x) => (
                  <option value={x}>{x}</option>
                ))}
              </NativeSelect>
              <FormHelperText>
                Choose Service to change name (Please wait if you see the list
                empty as data being loaded)
              </FormHelperText>

              <TextField
                id="outlined-full-width"
                label="Change name to"
                style={{ marginTop: 30, width: "100%" }}
                placeholder=""
                required
                onChange={this.updateInput}
                name="serviceName"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "100%",
                  marginTop: 35,
                }}
                onClick={this.handleDelete}
                startIcon={<Delete />}
              >
                Save Changes
              </Button>
              <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle style={{ color: "#f00" }} id="alert-dialog-title">
                  {"Warning! Are you sure?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Once you delete the service, then its sub-services and
                    service providers will also be permanently removed. This can
                    not be undone.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      this.setState({ open: false });
                    }}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={this.handleClose}
                    color="secondary"
                    autoFocus
                  >
                    Proceed
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Grid>
          <Grid item xs={6}>
            <input
              className="fileInput"
              type="file"
              style={{
                borderBottom: "4px solid lightgray",
                borderRight: "4px solid lightgray",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
                marginTop: 20,
                padding: 10,
                width: 420,
                cursor: "pointer",
              }}
              onChange={(e) => this.handleImageChange(e)}
            />
            <div
              className="imgPreview"
              style={{
                textAlign: "center",
                margin: "5px 15px",
                height: 123,
                width: 150,
                marginTop: 20,
                marginLeft: 35,
                borderLeft: "1px solid gray",
                borderRight: "1px solid gray",
                borderTop: "5px solid gray",
                borderBottom: "5px solid gray",
              }}
            >
              {$imagePreview}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}
