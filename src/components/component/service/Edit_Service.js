import React, { Component } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";
import { storage } from "../../../Firebase";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import Delete from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const database = firebase.database();
const ref = database.ref("ServiceList");

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
      subServiceName: "",
      count: null,
      isCountAvailable: false,
      labelWidth: 0,
      service: "",
      dataSnapshot: null,
      serviceCount: 0,
      serviceList: []
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
    this.return_data(0);
  };

  handleClose = () => {
    this.setState({ open: false });
    this.return_data(0);
    this.delete_service();
    this.adjust_database();
    this.populate_service_list();
    this.get_child_count();
  };

  async populate_service_list() {
    await ref.once("value", snapshot => {
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
  }

  async get_child_count() {
    var childCount;
    await ref.once("value", snapshot => {
      this.setState({ count: snapshot.numChildren() });
      childCount = snapshot.numChildren();
    });
    return childCount;
  }

  handleChange = service => event => {
    this.setState({
      ...this.state,
      [service]: event.target.value,
      serviceCount: event.target.selectedIndex + 1
    });
    console.log(event.target.selectedIndex);
  };

  async return_data(i) {
    var dataSnapshotVal;
    var ref2 = database
      .ref("ServiceList")
      .child(`${this.state.serviceCount + 1 + i}`);
    try {
      dataSnapshotVal = await ref2.once("value");
      return dataSnapshotVal.val();
    } catch (error) {}
    return dataSnapshotVal;
  }

  delete_service = () => {
    ref.child(`${this.state.serviceCount}`).remove();
  };

  async adjust_database() {
    if (this.state.serviceCount < this.state.count) {
      var loopCount = this.state.count - this.state.serviceCount;
      for (var i = 0; i < loopCount; i++) {
        var newData = await this.return_data(i);
        setTimeout(() => {}, 6);
        ref.child(`${this.state.serviceCount + i}`).set(newData);
      }
    }
    ref.child(`${this.state.count}`).remove();
    setTimeout(() => {}, 3);
    window.location.reload();
    alert("Service removed from database.");
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
    return (
      <div style={{ width: "100%" }}>
        <NativeSelect
          style={{
            marginTop: 2,
            width: "100%"
          }}
          value={this.state.service}
          name="service"
          onChange={this.handleChange("service")}
          inputProps={{ "aria-label": "service" }}
        >
          {this.state.serviceList.map(x => (
            <option value={x}>{x}</option>
          ))}
        </NativeSelect>
        <FormHelperText>
          Choose Service to delete (Please wait if you see the list empty as
          data being loaded)
        </FormHelperText>
        <Button
          variant="contained"
          color="primary"
          style={{
            width: "100%",
            marginTop: 35
          }}
          onClick={this.handleDelete}
          startIcon={<Delete />}
        >
          Delete Service
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
              Once you delete the service, then its sub-services and service
              providers will also be permanently removed. This can not be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="secondary" autoFocus>
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
