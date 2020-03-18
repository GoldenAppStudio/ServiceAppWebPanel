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

export default class Edit_Sub_Service extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      service: "",
      subService: "",
      serviceCount: 0,
      subServiceCount: 0,
      serviceList: [],
      subServiceList: []
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
    this.return_data(0);
  };

  handleClose = () => {
    this.setState({ open: false });
    this.return_data(0);
    this.delete_sub_service();
    this.populate_service_list();
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

  async populate_sub_service_list(e) {
    await ref
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

  handleChange = service => event => {
    this.setState({
      ...this.state,
      [service]: event.target.value,
      serviceCount: event.target.selectedIndex + 1,
      subServiceList: []
    });
    this.populate_sub_service_list(event.target.selectedIndex + 1);
  };

  get_index = subService => event => {
    this.setState({
      ...this.state,
      [subService]: event.target.value,
      subServiceCount: event.target.selectedIndex
    });
  };

  async return_data(i) {
    var dataSnapshotVal;
    var ref2 = database
      .ref("ServiceList")
      .child(this.state.serviceCount)
      .child("subService")
      .child(`${this.state.subServiceCount + 1 + i}`);

    try {
      dataSnapshotVal = await ref2.once("value");
      return dataSnapshotVal.val();
    } catch (error) {}
    return dataSnapshotVal;
  }

  delete_sub_service = () => {
    ref
      .child(this.state.serviceCount)
      .child("subService")
      .child(this.state.subServiceCount)
      .remove();
    this.adjust_database();
  };

  async adjust_database() {
    if (this.state.subServiceCount < this.state.subServiceList.length) {
      var loopCount =
        this.state.subServiceList.length - this.state.subServiceCount;
      console.log(loopCount + " loopCount");
      for (var i = 0; i < loopCount; i++) {
        var newData = await this.return_data(i);
        setTimeout(() => {}, 6);
        ref
          .child(this.state.serviceCount)
          .child("subService")
          .child(`${this.state.subServiceCount + i}`)
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
    alert("Sub-Service removed from database.");
  }

  handleDelete = () => {
    this.handleClickOpen();
    this.setState({ serviceList: [] });
    this.populate_service_list();
  };

  componentDidMount() {
    this.populate_service_list();
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
          <option value="" disabled>
            Choose Service
          </option>
          {this.state.serviceList.map(x => (
            <option value={x}>{x}</option>
          ))}
        </NativeSelect>
        <FormHelperText>
          Choose Service to delete (Please wait if you see the list empty as
          data being loaded)
        </FormHelperText>

        <NativeSelect
          style={{
            marginTop: 35,
            width: "100%"
          }}
          value={this.state.subService}
          name="subService"
          onChange={this.get_index("subService")}
          inputProps={{ "aria-label": "subService" }}
        >
          <option value="" disabled>
            Choose Sub-Service
          </option>
          {this.state.subServiceList.map(x => (
            <option value={x}>{x}</option>
          ))}
        </NativeSelect>
        <FormHelperText>
          Choose Sub-Service to delete (Please wait if you see the list empty as
          data being loaded)
        </FormHelperText>
        <Button
          variant="contained"
          color="primary"
          style={{
            width: "100%",
            marginTop: 45
          }}
          onClick={this.handleDelete}
          startIcon={<Delete />}
        >
          Delete Sub-Service
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
              Once you delete the sub-service, then its service providers will
              also be permanently removed. This can not be undone.
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
