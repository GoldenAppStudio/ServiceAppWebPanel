import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import { storage } from "../../../Firebase";
import firebase from "firebase";
import ImageUploader from "react-images-upload";
import Add from "@material-ui/icons/AddBoxRounded";
import FormHelperText from "@material-ui/core/FormHelperText";
import NativeSelect from "@material-ui/core/NativeSelect";

const database = firebase.database();
const ref = database.ref("service_list");

export default class Edit_Service extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
      pic: null,
      newServiceName: "",
      currentServiceName: "",
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

  handleClick = () => {
    this.setState({ loading: true });
    if (
      this.state.currentServiceName === "" ||
      this.state.currentServiceName === "Choose Service" ||
      (this.state.pic === null && this.state.newServiceName === "")
    ) {
      this.setState({
        warning: true,
        error: false,
        success: false,
        loading: false,
      });
    } else {
      if (this.state.pic === null) this.change_service_name();
      else if (this.state.newServiceName === "") this.change_service_pic();
      else {
        ref.once("value", (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            if (
              childSnapshot.child("service_name").val() ===
              this.state.currentServiceName
            ) {
              const uploadTask = storage
                .child(`service_images/${childSnapshot.child("UID").val()}.jpg`)
                .put(this.state.pic);
              uploadTask.on(
                "state_changed",
                (snapshot) => {},
                (error) => {
                  // error function ....
                  this.setState({ loading: false, error: true });
                },
                () => {
                  // complete function ....
                  ref
                    .child(childSnapshot.child("UID").val())
                    .child("service_name")
                    .set(this.state.newServiceName);
                  this.setState({
                    pic: null,
                    newServiceName: "",
                    loading: false,
                    success: true,
                    serviceList: ["Choose Service"],
                  });
                  this.populate_service_list();
                }
              );
            }
          });
        });
      }
    }
  };

  change_service_name = () => {
    ref.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (
          childSnapshot.child("service_name").val() ===
          this.state.currentServiceName
        ) {
          ref
            .child(childSnapshot.child("UID").val())
            .child("service_name")
            .set(this.state.newServiceName);
          this.setState({
            warning: false,
            error: false,
            success: true,
            loading: false,
            serviceList: ["Choose Service"],
          });
          this.populate_service_list();
        }
      });
    });
  };

  change_service_pic = () => {
    ref.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (
          childSnapshot.child("service_name").val() ===
          this.state.currentServiceName
        ) {
          const uploadTask = storage
            .child(`service_images/${childSnapshot.child("UID").val()}.jpg`)
            .put(this.state.pic);
          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              // error function ....
              this.setState({ loading: false, error: true });
            },
            () => {
              // complete function ....
              this.setState({
                pic: null,
                newServiceName: "",
                loading: false,
                success: true,
                serviceList: ["Choose Service"],
              });
              this.populate_service_list();
            }
          );
        }
      });
    });
  };

  onDrop = (picture) => this.setState({ pic: picture[0] });

  show_service_image = () => {
    ref.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (
          childSnapshot.child("service_name").val() ===
          this.state.currentServiceName
        ) {
          storage
            .child(`service_images/${childSnapshot.child("UID").val()}.jpg`)
            .getDownloadURL()
            .then((url) => this.setState({ url: url }));
        }
      });
    });
  };

  componentDidMount() {
    this.populate_service_list();
  }

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div
          className={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3 style={{ marginLeft: 150 }}>Edit Service</h3>
          <ImageUploader
            fileContainerStyle={{ backgroundColor: "#ddd" }}
            withIcon={true}
            buttonStyles={{ backgroundColor: "#c55" }}
            withPreview
            label="Choose, if you want to change service image"
            singleImage={true}
            buttonText="Choose image"
            onChange={this.onDrop}
            imgExtension={[".jpg", ".gif", ".png", ".gif"]}
            maxFileSize={5242880}
          />

          <div
            style={{
              width: 400,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                width: 100,
                float: "left",
              }}
            >
              {this.state.url === null ? (
                <CircularProgress style={{ marginTop: 30 }} />
              ) : (
                <img
                  alt=""
                  src={this.state.url}
                  style={{
                    height: 70,
                    width: 70,
                    textAlign: "center",
                    marginTop: 15,
                  }}
                />
              )}
            </div>
            <div
              style={{
                marginLeft: 100,
              }}
            >
              <NativeSelect
                style={{
                  marginTop: 25,
                  width: 300,
                }}
                value={this.state.currentServiceName}
                name="service"
                onChange={(e) => {
                  this.setState({ currentServiceName: e.target.value });
                  this.show_service_image();
                }}
                inputProps={{ "aria-label": "service" }}
              >
                {this.state.serviceList.map((x) => (
                  <option value={x}>{x}</option>
                ))}
              </NativeSelect>
              <FormHelperText style={{ marginBottom: 25 }}>
                Choose Service to edit (Please wait if list is empty)
              </FormHelperText>
            </div>
          </div>

          <form
            className={{
              width: "100%", // Fix IE 11 issue.
              marginTop: 5,
            }}
            noValidate
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="New Service Name"
              name="email"
              autoComplete="email"
              autoFocus
              style={{ marginBottom: 20 }}
              onChange={(e) => {
                this.setState({
                  loading: false,
                  success: false,
                  warning: false,
                  error: false,
                  newServiceName: e.target.value,
                });
              }}
            />
            {this.state.success ? (
              <Alert variant="outlined" severity="success">
                Service is successfully added to the database!
              </Alert>
            ) : (
              ""
            )}

            {this.state.error ? (
              <Alert variant="outlined" severity="error">
                Unexpected error occured. Please try later!
              </Alert>
            ) : (
              ""
            )}

            {this.state.warning ? (
              <Alert variant="outlined" severity="warning">
                Please fill name, select image or choose service!
              </Alert>
            ) : (
              ""
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={this.handleClick}
              style={{ marginTop: 15 }}
              disabled={this.state.loading}
              startIcon={<Add />}
            >
              {!this.state.loading ? "Update Service" : <CircularProgress />}
            </Button>
            <Grid container></Grid>
          </form>
        </div>
      </Container>
    );
  }
}
