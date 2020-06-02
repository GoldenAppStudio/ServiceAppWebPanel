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
      newSubServiceName: "",
      currentServiceName: "",
      currentSubServiceName: "",
      serviceList: ["Choose Service"],
      subServiceList: ["Choose Sub-Service"],
      success: false,
      warning: false,
      SERVICE_UID: "",
      SUB_SERVICE_UID: "",
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
      this.state.currentSubServiceName === "" ||
      this.state.currentSubServiceName === "Choose Service" ||
      (this.state.pic === null && this.state.newSubServiceName === "")
    ) {
      this.setState({
        warning: true,
        error: false,
        success: false,
        loading: false,
      });
    } else {
      if (this.state.pic === null) this.change_sub_service_name();
      else if (this.state.newSubServiceName === "")
        this.change_sub_service_pic();
      else {
        ref
          .child(this.state.SERVICE_UID)
          .child("sub_service")
          .once("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              if (
                childSnapshot.child("ss_name").val() ===
                this.state.currentSubServiceName
              ) {
                const uploadTask = storage
                  .child(
                    `sub_service_images/${childSnapshot.child("UID").val()}.jpg`
                  )
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
                      .child(this.state.SERVICE_UID)
                      .child("sub_service")
                      .child(childSnapshot.child("UID").val())
                      .child("ss_name")
                      .set(this.state.newSubServiceName);
                    this.setState({
                      pic: null,
                      newSubServiceName: "",
                      loading: false,
                      success: true,
                      serviceList: ["Choose Service"],
                      subServiceList: ["Choose Sub-Service"],
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

  change_sub_service_name = () => {
    ref
      .child(this.state.SERVICE_UID)
      .child("sub_service")
      .once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (
            childSnapshot.child("ss_name").val() ===
            this.state.currentSubServiceName
          ) {
            ref
              .child(this.state.SERVICE_UID)
              .child("sub_service")
              .child(childSnapshot.child("UID").val())
              .child("ss_name")
              .set(this.state.newSubServiceName);
            this.setState({
              warning: false,
              error: false,
              success: true,
              loading: false,
              serviceList: ["Choose Service"],
              subServiceList: ["Choose Sub-Service"],
            });
            this.populate_service_list();
          }
        });
      });
  };

  change_sub_service_pic = () => {
    ref
      .child(this.state.SERVICE_UID)
      .child("sub_service")
      .once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (
            childSnapshot.child("ss_name").val() ===
            this.state.currentSubServiceName
          ) {
            const uploadTask = storage
              .child(
                `sub_service_images/${childSnapshot.child("UID").val()}.jpg`
              )
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
                  newSubServiceName: "",
                  loading: false,
                  success: true,
                  serviceList: ["Choose Service"],
                  subServiceList: ["Choose Sub-Service"],
                });
                this.populate_service_list();
              }
            );
          }
        });
      });
  };

  async get_service_uid() {
    await ref.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (
          childSnapshot.child("service_name").val() ===
          this.state.currentServiceName
        ) {
          this.setState({ SERVICE_UID: childSnapshot.child("UID").val() });
          this.populate_sub_service_list();
        }
      });
    });
  }

  async populate_sub_service_list() {
    this.setState({ subServiceList: ["Choose Sub-Service"] });
    await ref
      .child(this.state.SERVICE_UID)
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

  onDrop = (picture) => this.setState({ pic: picture[0] });

  show_sub_service_image = () => {
    ref
      .child(this.state.SERVICE_UID)
      .child("sub_service")
      .once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (
            childSnapshot.child("ss_name").val() ===
            this.state.currentSubServiceName
          ) {
            storage
              .child(
                `sub_service_images/${childSnapshot.child("UID").val()}.jpg`
              )
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
          <h3 style={{ marginLeft: 150 }}>Edit Sub-Service</h3>
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

          <NativeSelect
            style={{
              marginTop: 10,
              width: 400,
            }}
            value={this.state.currentServiceName}
            name="service"
            onChange={(e) => {
              this.setState({ currentServiceName: e.target.value });
              this.get_service_uid();
            }}
            inputProps={{ "aria-label": "service" }}
          >
            {this.state.serviceList.map((x) => (
              <option value={x}>{x}</option>
            ))}
          </NativeSelect>
          <FormHelperText style={{ marginBottom: 25 }}>
            Choose Service (Please wait for a moment if the list is empty)
          </FormHelperText>

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
                <CircularProgress style={{ marginTop: 10 }} />
              ) : (
                <img
                  alt=""
                  src={this.state.url}
                  style={{
                    height: 70,
                    width: 70,
                    textAlign: "center",
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
                  marginTop: 10,
                  width: 300,
                }}
                value={this.state.currentSubServiceName}
                name="service"
                onChange={(e) => {
                  this.setState({ currentSubServiceName: e.target.value });
                  this.show_sub_service_image();
                }}
                inputProps={{ "aria-label": "service" }}
              >
                {this.state.subServiceList.map((x) => (
                  <option value={x}>{x}</option>
                ))}
              </NativeSelect>
              <FormHelperText style={{ marginBottom: 25 }}>
                Choose Sub-Service to edit ( wait if list is empty )
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
              label="New Sub-Service Name"
              name="email"
              autoComplete="email"
              style={{ marginBottom: 20 }}
              onChange={(e) => {
                this.setState({
                  loading: false,
                  success: false,
                  warning: false,
                  error: false,
                  newSubServiceName: e.target.value,
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
                Please fill name, select image, choose service or sub-service!
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
              {!this.state.loading ? (
                "Update Sub-Service"
              ) : (
                <CircularProgress />
              )}
            </Button>
            <Grid container></Grid>
          </form>
        </div>
      </Container>
    );
  }
}
