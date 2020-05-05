import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import { storage } from "../../../Firebase";
import firebase from "firebase";
import ImageUploader from "react-images-upload";
import FormHelperText from "@material-ui/core/FormHelperText";
import NativeSelect from "@material-ui/core/NativeSelect";
import Add from "@material-ui/icons/AddBoxRounded";

const database = firebase.database();
const ref = database.ref("service_list");
var serviceList = ["Choose Service"];
var UID = null;

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

async function populate_service_list() {
  await ref.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      serviceList = serviceList.concat(
        childSnapshot.child("service_name").val()
      );
    });
  });
}

populate_service_list();

export default function AddSubService() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [serviceName, setServiceName] = React.useState("Travel");
  // const [serviceList, setServiceList] = React.useState([]);
  const [subServiceName, setSubServiceName] = React.useState("");
  const [successAlert, setSuccessAlert] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState(false);
  const [warningAlert, setWarningAlert] = React.useState(false);
  const [image, setImage] = React.useState("");

  const handleButtonClick = () => {
    if (image === "" || subServiceName === "") {
      setWarningAlert(true);
    } else {
      setLoading(true);
      setWarningAlert(false);
      // upload image and service data
      get_service_uid();
    }
  };

  async function get_service_uid() {
    await ref.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.child("service_name").val() === serviceName) {
          UID = childSnapshot.child("UID").val();
          uploadData();
        }
      });
    });
  }

  const uploadData = () => {
    var mRef = database.ref("service_list").child(UID);
    var pushRef = mRef.child("sub_service").push();
    pushRef.set(
      {
        ss_name: subServiceName.trim(),
        UID: pushRef.key.toString().trim(),
      },
      () => {
        const uploadTask = storage
          .child(`sub_service_images/${pushRef.key.toString()}.jpg`)
          .put(image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            // error function ....
            setErrorAlert(true);
            setLoading(false);
            console.log(error);
          },
          () => {
            // complete function ....
            setImage("");
            setServiceName("");
            setLoading(false);
            setSuccessAlert(true);
          }
        );
      }
    );
  };

  const onDrop = (picture) => setImage(picture[0]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <h3>Add Sub-Service</h3>
        <ImageUploader
          fileContainerStyle={{ backgroundColor: "#ddd" }}
          withIcon={true}
          buttonStyles={{ backgroundColor: "#c55" }}
          withPreview
          singleImage={true}
          buttonText="Choose image"
          onChange={onDrop}
          imgExtension={[".jpg", ".gif", ".png", ".gif"]}
          maxFileSize={5242880}
        />
        <NativeSelect
          style={{
            marginTop: 10,
            width: "100%",
          }}
          value={serviceName}
          name="service"
          onChange={(e) => {
            setServiceName(e.target.value);
            get_service_uid();
          }}
          inputProps={{ "aria-label": "service" }}
        >
          {serviceList.map((x) => (
            <option value={x}>{x}</option>
          ))}
        </NativeSelect>
        <FormHelperText>
          Choose Service (Wait if you see the list empty as data being loaded)
        </FormHelperText>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Sub-Service Name"
            name="email"
            autoComplete="email"
            style={{ marginBottom: 20 }}
            onChange={(e) => {
              setSubServiceName(e.target.value);
            }}
          />
          {successAlert ? (
            <Alert variant="outlined" severity="success">
              Service is successfully added to the database!
            </Alert>
          ) : (
            ""
          )}

          {errorAlert ? (
            <Alert variant="outlined" severity="error">
              Unexpected error occured. Please try later!
            </Alert>
          ) : (
            ""
          )}

          {warningAlert ? (
            <Alert variant="outlined" severity="warning">
              Please fill name or select image!
            </Alert>
          ) : (
            ""
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className={classes.submit}
            disabled={loading}
            startIcon={<Add />}
            onClick={handleButtonClick}
          >
            {!loading ? "Add Service" : <CircularProgress />}
          </Button>

          <Grid container></Grid>
        </form>
      </div>
    </Container>
  );
}
