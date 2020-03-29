import React, { Component } from "react";
import firebase from "firebase";
import storage from "firebase";
import clsx from "clsx";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

const data = [];
const db = firebase.firestore();
const database = firebase.database();
var storageRef = firebase.storage().ref();
var spaceRef = storageRef.child("ads_images/1.jpg");
var path = spaceRef.fullPath;
var test;
storageRef
  .child("ads_images/1.jpg")
  .getDownloadURL()
  .then(function(url) {
    test = url;
  })
  .catch(function(error) {});

export default class NewServiceProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCount: 0
    };
    this.interval = setInterval(
      () => this.setState({ time: Date.now() }),
      1000
    );
  }
  async get_service_providers() {
    await db
      .collection("Users")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          data.push(doc.data());
        });
      });
  }

  deny_request = id => (event, expanded) => {
    db.collection("Users")
      .doc(id)
      .delete()
      .then(function() {
        alert("Service Provider permission denied.");
        window.location.reload();
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  };

  allow_request = snapshot => (event, expanded) => {
    this.get_total_count(snapshot);
  };

  async get_total_count(snapshot) {
    const ref2 = database.ref(
      `Service/${snapshot.service}/${snapshot.sub}/${snapshot.state}/${snapshot.district}/`
    );
    console.log(
      `Service/${snapshot.sub}/${snapshot.state}/${snapshot.district}/`
    );
    await ref2.once("value", ds => {
      this.setState({ totalCount: ds.numChildren() });
      this.upload_first(snapshot);
    });
    console.log(this.state.totalCount);
  }

  async upload_first(snapshot) {
    const ref3 = database.ref(
      `Service/${snapshot.service}/${snapshot.sub}/${snapshot.state}/${snapshot.district}/`
    );
    ref3.child(this.state.totalCount + 1).update(snapshot);
    ref3
      .child(this.state.totalCount + 1)
      .child("priority")
      .set(`${this.state.totalCount + 1}`);
    ref3
      .child(this.state.totalCount + 1)
      .child("uid")
      .set(`${this.state.totalCount + 1}`);
    this.upload_second(snapshot);
  }

  async upload_second(snapshot) {
    const ref4 = database.ref(`AutoSP/${snapshot.login}/`);
    ref4.update(snapshot);
    ref4.child("priority").set(`${this.state.totalCount + 1}`);
    ref4.child("uid").set(`${this.state.totalCount + 1}`);
    db.collection("Users")
      .doc(snapshot.login)
      .delete()
      .then(function() {
        alert("Service Provider permission granted.");
        window.location.reload();
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  }

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
            <Typography>{snapshot.service}</Typography>
          </div>
          <div style={{ flexBasis: "33.33%" }}>
            <Typography>{snapshot.sub}</Typography>
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
          <img
            src={test}
            style={{
              backgroundRepeat: "no-repeat",
              backgroundPosition: "50%",
              borderRadius: "50%",
              width: 75,
              height: 75
            }}
            alt="Avatar"
          />

          <div style={{ marginLeft: 20 }}>
            <Typography>{snapshot.description}</Typography>
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button
            onClick={this.deny_request(snapshot.login)}
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
