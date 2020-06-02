import React, { Component } from "react";
import firebase from "firebase";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

const data = [];
const db = firebase.firestore();
const database = firebase.database();

export default class NewServiceProvider extends Component {
  constructor(props) {
    super(props);

    this.interval = setInterval(
      () => this.setState({ time: Date.now() }),
      1000
    );
  }

  async get_service_providers() {
    await db
      .collection("Users")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          data.push(doc.data());
        });
      });
  }

  deny_request = (id) => () => {
    db.collection("Users")
      .doc(id)
      .delete()
      .then(function () {
        database.ref().child("PendingRequests").child(id).remove();
        alert("Service Provider removed from list.");
        window.location.reload();
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  };

  get_service_uid = (snapshot) => {
    database
      .ref()
      .child("service_list")
      .once("value", (s) => {
        s.forEach((childSnapshot) => {
          if (childSnapshot.child("service_name").val() === snapshot.service) {
            snapshot.service = childSnapshot.child("UID").val();
            childSnapshot.child("sub_service").forEach((value) => {
              if (value.child("ss_name").val() === snapshot.sub_service) {
                snapshot.sub_service = value.child("UID").val();
                database
                  .ref()
                  .child("service_providers")
                  .child(snapshot.UID)
                  .update(snapshot);
                window.location.reload();
              }
            });
          }
        });
      });
  };

  allow_request = (snapshot) => () => {
    this.get_service_uid(snapshot);
    db.collection("Users")
      .doc(snapshot.UID)
      .delete()
      .then(function () {
        database.ref().child("PendingRequests").child(snapshot.UID).remove();
        alert("Service Provider added to database.");
        window.location.reload();
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
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
            <Typography>{snapshot.service}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.sub_service}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.state}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.district}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.phone}</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div style={{ marginLeft: 20 }}>
            <Typography>{snapshot.description}</Typography>
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button
            onClick={this.deny_request(snapshot.UID)}
            variant="outlined"
            color="secondary"
          >
            Deny
          </Button>
          <Button
            color="primary"
            onClick={this.allow_request(snapshot)}
            variant="outlined"
          >
            Allow Request
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  };

  componentDidMount() {
    this.get_service_providers();
  }

  render() {
    return (
      <div style={{ width: "100%" }}>
        <h2 style={{ textAlign: "center" }}>New Service Provider Request</h2>
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
        {data.map(this.get_sp_table)}
      </div>
    );
  }
}
