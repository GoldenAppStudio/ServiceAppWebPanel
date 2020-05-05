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
var UID;

export default class DeleteService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      service: "",
      serviceList: ["Choose Service"],
      success: false,
      warning: false,
      error: false,
      loading: false,
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

  handleChange = (service) => (event) => {
    this.setState({
      ...this.state,
      [service]: event.target.value,
    });
  };

  async get_service_uid() {
    if (this.state.service === "Choose Service" || this.state.service === "") {
      this.setState({ warning: true, loading: false });
    } else {
      await ref.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (
            childSnapshot.child("service_name").val() === this.state.service
          ) {
            var deleteRef = database
              .ref("service_list")
              .child(childSnapshot.child("UID").val());
            deleteRef.remove(() => {
              this.setState({
                success: true,
                loading: false,
                serviceList: ["Choose Service"],
              });
              this.populate_service_list();
            });
          }
        });
      });
    }
  }

  componentDidMount() {
    this.populate_service_list();
  }

  render() {
    return (
      <div className="container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1>Delete Service.</h1>
          <NativeSelect
            style={{
              marginTop: 2,
              width: 480,
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
          <FormHelperText style={{ marginBottom: 25 }}>
            Choose Service to delete (Please wait if you see the list empty as
            data being loaded)
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
            style={{
              marginTop: 35,
              width: 480,
            }}
            disabled={this.state.loading}
            onClick={() => {
              this.setState({ open: true });
            }}
            startIcon={<Delete />}
          >
            {!this.state.loading ? "Add Service" : <CircularProgress />}
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
              <Button
                onClick={() => {
                  this.setState({ open: false });
                }}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                color="secondary"
                onClick={() => {
                  this.setState({
                    open: false,
                    warning: false,
                    success: false,
                    loading: true,
                  });
                  this.get_service_uid();
                }}
              >
                Proceed
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}
