import React, { Component } from "react";
import { storage } from "../../../Firebase";
import firebase from "firebase";

import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

const database = firebase.database();
const ref = database.ref("ServiceList");

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      file: "",
      imagePreviewUrl: "",
      url: "",
      progress: 0,
      serviceName: "",
      count: 0,
      isCountAvailable: false,
    };
  }

  updateInput = (event) => {
    this.setState({ serviceName: event.target.value });
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

  get_child_count = () => {
    ref.once("value", (snapshot) => {
      this.setState({ count: snapshot.numChildren() });
    });
  };

  add_service = () => {
    if (this.state.count === 0) {
      setTimeout(() => {}, 2);
      alert("Connection timeout! Please try again");
    } else {
      ref
        .child(this.state.count + 1)
        .child("service")
        .set(this.state.serviceName);
    }
  };

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
        console.log("count: " + this.state.count);
        this.add_service();
        alert("Service Added");
      }
    );
  };

  handleUpload = () => {
    this.get_child_count();
    this.upload_image();
    this.setState({
      count: 0,
    });
  };

  render() {
    const fileInputStyle = {
      borderBottom: "4px solid lightgray",
      borderRight: "4px solid lightgray",
      borderTop: "1px solid black",
      borderLeft: "1px solid black",
      marginTop: 20,
      padding: 10,
      width: 420,
      cursor: "pointer",
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
      borderBottom: "5px solid gray",
    };

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
        <div className="previewText">Please select an Image for Preview</div>
      );
    }

    return (
      <div style={{}}>
        <form>
          <progress
            value={this.state.progress}
            max="100"
            style={{ width: "100%" }}
          />
          <div style={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <input
                  className="fileInput"
                  type="file"
                  style={fileInputStyle}
                  onChange={(e) => this.handleImageChange(e)}
                />
                <TextField
                  id="outlined-full-width"
                  label="Name of service"
                  style={{ marginTop: 30, width: "100%" }}
                  placeholder="Name of service"
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
                  onClick={this.handleUpload}
                  startIcon={<CloudUploadIcon />}
                >
                  Add Service
                </Button>{" "}
              </Grid>
              <Grid item xs={6}>
                <div className="imgPreview" style={imagePreviewStyle}>
                  {$imagePreview}
                </div>
              </Grid>
            </Grid>
          </div>
        </form>
      </div>
    );
  }
}

export default FileUpload;
