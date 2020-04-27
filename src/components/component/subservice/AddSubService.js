import React, { Component } from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import { storage } from "../../../Firebase";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

const database = firebase.database();
const ref = database.ref("ServiceList");

export default class AddSubService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      file: "",
      imagePreviewUrl: "",
      url: "",
      progress: 0,
      subServiceName: "",
      count: null,
      isCountAvailable: false,
      labelWidth: 0,
      service: "",
      serviceCount: 2,
      serviceList: [],
    };
  }

  updateInput = (event) => {
    this.setState({ subServiceName: event.target.value });
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

  populate_service_list = () => {
    ref.once("value", (snapshot) => {
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
  };

  get_child_count = () => {
    const ref2 = database.ref(
      `ServiceList/${this.state.serviceCount}/subService`
    );
    ref2.once("value", (snapshot) => {
      this.setState({ count: snapshot.numChildren() });
    });
  };

  add_service = () => {
    const ref3 = database.ref(
      `ServiceList/${this.state.serviceCount}/subService`
    );
    if (this.state.count == null) {
      setTimeout(() => {}, 2);
      alert("Connection timeout! Please try again");
    } else {
      ref3
        .child(this.state.count + 1)
        .child("name")
        .set(this.state.subServiceName);
    }
  };

  upload_image = () => {
    const uploadTask = storage
      .child(
        `service/sub-service/${
          this.state.service
        }/${this.state.subServiceName.trim()}.jpg`
      )
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
        alert("Sub-Service Added");
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

  handleChange = (service) => (event) => {
    this.setState({
      ...this.state,
      [service]: event.target.value,
      serviceCount: event.target.selectedIndex + 2,
    });
  };

  componentWillMount() {
    this.populate_service_list();
  }

  render() {
    const fileInputStyle = {
      borderBottom: "4px solid lightgray",
      borderRight: "4px solid lightgray",
      borderTop: "1px solid black",
      borderLeft: "1px solid black",
      marginTop: 20,
      padding: 10,
      width: 440,
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
          alt={"this"}
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
        <div style={{ flexGrow: 1 }}>
          <form>
            <progress
              value={this.state.progress}
              max="100"
              style={{ width: "100%" }}
            />
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <FormControl
                  style={{
                    margin: 1,
                    marginTop: 15,
                    minWidth: "100%",
                  }}
                >
                  <NativeSelect
                    style={{
                      marginTop: 2,
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
                    Choose Service (Please wait if you see the list empty as
                    data being loaded)
                  </FormHelperText>
                </FormControl>
                <input
                  className="fileInput"
                  type="file"
                  style={fileInputStyle}
                  onChange={(e) => this.handleImageChange(e)}
                />
                <TextField
                  id="outlined-full-width"
                  label="Name of Sub-Service"
                  style={{ marginTop: 30, width: "100%" }}
                  placeholder="Name of Sub-Service"
                  required
                  onChange={this.updateInput}
                  name="subServiceName"
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
                  Add Sub-Service
                </Button>
              </Grid>
              <Grid item xs={6}>
                <div className="imgPreview" style={imagePreviewStyle}>
                  {$imagePreview}
                </div>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    );
  }
}
