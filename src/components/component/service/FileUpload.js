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
import Add from "@material-ui/icons/AddBoxRounded";

const database = firebase.database();
const ref = database.ref("service_list");

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

export default function FileUpload() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [serviceName, setServiceName] = React.useState("");
  const [successAlert, setSuccessAlert] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState(false);
  const [warningAlert, setWarningAlert] = React.useState(false);
  const [image, setImage] = React.useState("");

  const handleButtonClick = () => {
    if (image === "" || serviceName === "") {
      setWarningAlert(true);
    } else {
      setLoading(true);
      setWarningAlert(false);
      // upload image and service data
      uploadData();
    }
  };

  const uploadData = () => {
    var pushRef = ref.push();
    pushRef.set(
      {
        service_name: serviceName.trim(),
        UID: pushRef.key.toString().trim(),
      },
      () => {
        const uploadTask = storage
          .child(`service_images/${pushRef.key.toString()}.jpg`)
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

  const onDrop = (picture) => {
    setSuccessAlert(false);
    setWarningAlert(false);
    setErrorAlert(false);
    setImage(picture[0]);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <h3>Add Service</h3>
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
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Service Name"
            name="email"
            autoComplete="email"
            autoFocus
            style={{ marginBottom: 20 }}
            onChange={(e) => {
              setSuccessAlert(false);
              setWarningAlert(false);
              setErrorAlert(false);
              setServiceName(e.target.value);
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
