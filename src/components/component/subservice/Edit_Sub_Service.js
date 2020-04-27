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

var mSubServiceCount;

var test;
var storageRef = firebase.storage().ref();
storageRef
  .child("ads_images/1.jpg")
  .getDownloadURL()
  .then(function (url) {
    test = url;
  })
  .catch(function () {});

export default class Edit_Sub_Service extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      service: "",
      subService: "",
      subServiceName: "",
      serviceCount: 0,
      subServiceCount: 0,
      serviceList: [],
      subServiceList: [],
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
      .child(`service/${this.state.subServiceName.trim()}.jpg`)
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

  handleClose = () => {
    this.setState({ open: false });
    /* this.return_data(0);
    this.delete_sub_service();
    this.populate_service_list(); */

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
  };

  async populate_service_list() {
    await ref.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.child("service").val() === "Travel") {
        } else {
          this.setState({
            serviceList: this.state.serviceList.concat([
              childSnapshot.child("service").val(),
            ]),
          });
        }
      });
    });
  }

  async populate_sub_service_list(e) {
    await ref
      .child(e)
      .child("subService")
      .once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          this.setState({
            subServiceList: this.state.subServiceList.concat([
              childSnapshot.child("name").val(),
            ]),
          });
        });
      });
  }

  handleChange = (service) => (event) => {
    this.setState({
      ...this.state,
      [service]: event.target.value,
      serviceCount: event.target.selectedIndex + 1,
      subServiceList: [],
    });
    this.populate_sub_service_list(event.target.selectedIndex + 1);
  };

  get_index = (subService) => (event) => {
    this.setState({
      ...this.state,
      [subService]: event.target.value,
      subServiceCount: event.target.selectedIndex,
    });
    mSubServiceCount = event.target.selectedIndex;
    storageRef
      .child("service")
      .child("sub-service")
      .child(`${this.state.service}/${event.target.value}.jpg`)
      .getDownloadURL()
      .then(function (url) {
        test = url;
      })
      .catch(function () {});
  };

  async return_data(i) {
    /*   var dataSnapshotVal;
    var ref2 = database
      .ref("ServiceList")
      .child(this.state.serviceCount)
      .child("subService")
      .child(`${mSubServiceCount + 1 + i}`);

    try {
      dataSnapshotVal = await ref2.once("value");
      return dataSnapshotVal.val();
    } catch (error) {}
    return dataSnapshotVal; */
  }

  delete_sub_service = () => {
    /*   ref
      .child(this.state.serviceCount)
      .child("subService")
      .child(this.state.subServiceCount)
      .remove();
    this.adjust_database(); */
  };

  async adjust_database() {
    /* if (mSubServiceCount < this.state.subServiceList.length) {
      var loopCount = this.state.subServiceList.length - mSubServiceCount;
      console.log(loopCount + " loopCount");
      for (var i = 0; i < loopCount; i++) {
        var newData = await this.return_data(i);
        setTimeout(() => {}, 6);
        ref
          .child(this.state.serviceCount)
          .child("subService")
          .child(`${mSubServiceCount + i}`)
          .set(newData);
      }
    }
    ref
      .child(this.state.serviceCount)
      .child("subService")
      .child(this.state.subServiceList.length)
      .remove();
    setTimeout(() => {}, 3);
    window.location.reload();
    alert("Sub-Service removed from database."); */
  }

  updateInput = (event) => {
    this.setState({ subServiceName: event.target.value });
  };

  handleDelete = () => {
    this.handleClickOpen();
    this.setState({ serviceList: [] });
    this.populate_service_list();
  };

  componentDidMount() {
    this.populate_service_list();
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
                <option value="" disabled>
                  Choose Service
                </option>
                {this.state.serviceList.map((x) => (
                  <option value={x}>{x}</option>
                ))}
              </NativeSelect>
              <FormHelperText>
                Choose Service to delete (Please wait if you see the list empty
                as data being loaded)
              </FormHelperText>

              <NativeSelect
                style={{
                  marginTop: 35,
                  width: "100%",
                }}
                value={this.state.subService}
                name="subService"
                onChange={this.get_index("subService")}
                inputProps={{ "aria-label": "subService" }}
              >
                <option value="" disabled>
                  Choose Sub-Service
                </option>
                {this.state.subServiceList.map((x) => (
                  <option value={x}>{x}</option>
                ))}
              </NativeSelect>
              <FormHelperText>
                Choose Sub-Service to delete (Please wait if you see the list
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
                  marginTop: 45,
                }}
                onClick={this.handleDelete}
                startIcon={<Delete />}
              >
                Save Changes
              </Button>
              <Dialog
                open={this.state.open}
                onClose={() => {
                  this.setState({ open: false });
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle style={{ color: "#f00" }} id="alert-dialog-title">
                  {"Warning! Are you sure?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    You are about to change the name of selected sub-service.
                    Please select image if you haven't.
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
