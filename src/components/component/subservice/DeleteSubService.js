import React, { Component } from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import NativeSelect from "@material-ui/core/NativeSelect";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import Delete from "@material-ui/icons/Delete";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";

const database = firebase.database();
const ref = database.ref("service_list");

export default class DeleteSubService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      service: "",
      subService: "",
      serviceList: ["Choose Service"],
      subServiceList: ["Choose Sub-Service"],
      success: false,
      warning: false,
      error: false,
      loading: false,
      UID: "",
    };
  }

  async populate_service_list() {
    await ref.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        this.setState({
          serviceList: this.state.serviceList.concat(
            childSnapshot.child("service_name").val()
          ),
        });
      });
    });
  }

  async get_service_uid() {
    await ref.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.child("service_name").val() === this.state.service) {
          this.setState({ UID: childSnapshot.child("UID").val() });
          this.populate_sub_service_list();
        }
      });
    });
  }

  async populate_sub_service_list() {
    await ref
      .child(this.state.UID)
      .child("sub_service")
      .once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          this.setState({
            subServiceList: this.state.subServiceList.concat([
              childSnapshot.child("ss_name").val(),
            ]),
          });
        });
      });
  }

  delete_sub_service = () => {
    if (
      this.state.service === "" ||
      this.state.service === "Choose Service" ||
      this.state.subService === "" ||
      this.state.subService === "Choose Sub-Service"
    ) {
      this.setState({
        open: false,
        loading: false,
        warning: true,
        success: false,
        error: false,
      });
    } else {
      this.setState({
        open: false,
        loading: true,
        warning: false,
        success: false,
        error: false,
      });

      ref
        .child(this.state.UID)
        .child("sub_service")
        .once("value", (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            if (
              childSnapshot.child("ss_name").val() === this.state.subService
            ) {
              var deleteRef = database
                .ref("service_list")
                .child(this.state.UID)
                .child("sub_service")
                .child(childSnapshot.child("UID").val());
              deleteRef.remove(() => {
                this.setState({
                  success: true,
                  loading: false,
                  serviceList: ["Choose Service"],
                  subServiceList: ["Choose Sub-Service"],
                  service: this.state.service,
                });
                this.populate_service_list();
                this.populate_sub_service_list();
              });
            }
          });
        });
    }
  };

  componentDidMount() {
    this.populate_service_list();
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Delete Sub-Service</h1>
        <NativeSelect
          style={{
            marginTop: 2,
            width: 480,
          }}
          value={this.state.service}
          name="service"
          onChange={(e) => {
            this.setState({ service: e.target.value });
            this.get_service_uid();
          }}
          inputProps={{ "aria-label": "service" }}
        >
          {this.state.serviceList.map((x) => (
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
            width: 480,
          }}
          value={this.state.subService}
          name="subService"
          onChange={(e) => {
            this.setState({ subService: e.target.value });
          }}
          inputProps={{ "aria-label": "subService" }}
        >
          {this.state.subServiceList.map((x) => (
            <option value={x}>{x}</option>
          ))}
        </NativeSelect>
        <FormHelperText style={{ marginBottom: 20 }}>
          Choose SubService to delete (Wait if you see the list empty because
          data is loading)
        </FormHelperText>

        {this.state.success ? (
          <Alert variant="outlined" severity="success" style={{ width: 450 }}>
            Service is successfully deleted from the database!
          </Alert>
        ) : (
          ""
        )}

        {this.state.error ? (
          <Alert variant="outlined" severity="error" style={{ width: 450 }}>
            Unexpected error occured. Please try later!
          </Alert>
        ) : (
          ""
        )}

        {this.state.warning ? (
          <Alert variant="outlined" severity="warning" style={{ width: 450 }}>
            Please choose service to delete!
          </Alert>
        ) : (
          ""
        )}

        <Button
          variant="contained"
          color="primary"
          disabled={this.state.loading}
          style={{
            width: 480,
            marginTop: 45,
          }}
          onClick={() =>
            this.setState({
              open: true,
              warning: false,
              success: false,
              error: false,
              loading: false,
            })
          }
          startIcon={<Delete />}
        >
          {!this.state.loading ? "Delete Sub-Service" : <CircularProgress />}
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
              Once you delete the sub-service, then its service providers will
              also be permanently removed. This can not be undone.
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
              onClick={this.delete_sub_service}
              color="secondary"
              autoFocus
            >
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
