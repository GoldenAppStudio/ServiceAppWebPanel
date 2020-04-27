import React from "react";
import { Column, Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import LineChart from "react-svg-line-chart";
import firebase from "../../Firebase";
import Skeleton from "@material-ui/lab/Skeleton";

const database = firebase.database();

var dd = String(new Date().getDate()).padStart(2, "0");
var mm = String(new Date().getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = new Date().getFullYear();

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    border: "1px solid #000",
    borderRadius: 4,
    cursor: "pointer",
  },
  graphContainer: {
    marginTop: 24,
    marginLeft: 0,
    marginRight: 0,
    width: "100%",
  },
  graphSection: {
    padding: 24,
  },
  graphSubtitle: {
    fontFamily: "Muli",
    fontStyle: "normal",
    fontSize: 14,
    lineHeight: "16px",
    letterSpacing: "0.1px",
    color: "#555",
    marginTop: 4,
    marginRight: 8,
  },
  graphTitle: {
    fontFamily: "Muli",
    fontStyle: "normal",
    fontSize: 19,
    lineHeight: "24px",
    letterSpacing: "0.4px",
    color: "#000",
  },
  legendTitle: {
    fontFamily: "Muli",
    fontStyle: "normal",
    fontSize: 12,
    lineHeight: "15px",
    letterSpacing: "0.1px",
    color: "#000",
    marginLeft: 8,
  },
  separator: {
    backgroundColor: "#000",
    width: 1,
    minWidth: 1,
  },
  statContainer: {
    borderBottom: "1px solid #000",
    padding: "24px 32px 24px 32px",
    height: "calc(114px - 48px)",
    ":last-child": {
      border: "none",
    },
  },
  stats: {
    borderTop: "1px solid #000",
    width: "100%",
  },
  statTitle: {
    fontFamily: "Muli",
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: "22px",
    letterSpacing: "0.3px",
    textAlign: "center",
    color: "#555",
    whiteSpace: "nowrap",
    marginBottom: 6,
  },
  statValue: {
    fontFamily: "Muli",
    fontStyle: "normal",
    fontSize: 24,
    lineHeight: "30px",
    letterSpacing: "0.3px",
    textAlign: "center",
    color: "#000",
  },
});

const number_to_month_converter = (mm) => {
  switch (mm) {
    case "01":
      return "Jan";
    case "02":
      return "Feb";
    case "03":
      return "Mar";
    case "04":
      return "Apr";
    case "05":
      return "May";
    case "06":
      return "June";
    case "07":
      return "July";
    case "08":
      return "Aug";
    case "09":
      return "Sept";
    case "10":
      return "Oct";
    case "11":
      return "Nov";
    default:
      return "Dec";
  }
};

class TodayTrendsComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      timeSpendData: [],
      appLaunchedData: [],
      adSeenData: [],
      appLaunchedToday: "---",
      adSeenToday: "---",
      timeSpendToday: "---",
      adClickedToday: "---",
    };

    this.interval = setInterval(
      () => this.setState({ time: Date.now() }),
      1000
    );
  }

  // get total times the app is launched (last 30 days)
  get_app_launched_data = () => {
    let ref = database.ref("GraphData").child("appLaunched");
    ref.once("value", (snapshot) => {
      let array = snapshot.val();
      for (let x = 0; x <= 30; x++) {
        this.state.appLaunchedData.push({
          x: x,
          y: JSON.parse("[" + array + "]")[x],
        });
      }
    });
  };

  // get total times user see In-App Ad (last 30 days)
  get_ad_seen_data = () => {
    let ref = database.ref("GraphData").child("adSeenByUser");
    ref.once("value", (snapshot) => {
      let array = snapshot.val();
      for (let x = 0; x <= 30; x++) {
        this.state.adSeenData.push({
          x: x,
          y: JSON.parse("[" + array + "]")[x],
        });
      }
    });
  };

  // get total time all users spend on app (last 30 days)
  get_time_spend_data = () => {
    let ref = database.ref("GraphData").child("timeSpendOnApp");
    ref.once("value", (snapshot) => {
      let array = snapshot.val();
      for (let x = 1; x <= 30; x++) {
        this.state.timeSpendData.push({
          x: x,
          y: JSON.parse("[" + array + "]")[x],
        });
      }
    });
    console.log(this.state.timeSpendData);
  };

  componentDidMount() {
    this.get_app_launched_data();
    this.get_time_spend_data();
    this.get_ad_seen_data();

    let ref = database.ref("Today");
    ref.on("value", (snapshot) => {
      this.setState({
        appLaunchedToday: snapshot.child("app_launched").val(),
        adSeenToday: snapshot.child("ad_seen").val(),
        timeSpendToday: Math.round(snapshot.child("app_run_time").val() / 60),
        adClickedToday: snapshot.child("ad_clicked").val(),
      });
    });
  }

  renderLegend(color, title) {
    return (
      <Row vertical="center">
        <div
          style={{ width: 16, border: "2px solid", borderColor: color }}
        ></div>
        <span className={css(styles.legendTitle)}>{title}</span>
      </Row>
    );
  }

  renderStat(title, value) {
    return (
      <Column
        flexGrow={1}
        className={css(styles.statContainer)}
        vertical="center"
        horizontal="center"
      >
        <span className={css(styles.statTitle)}>{title}</span>
        <span className={css(styles.statValue)}>{value}</span>
      </Column>
    );
  }

  render() {
    return (
      <div>
        <Row
          flexGrow={1}
          className={css(styles.container)}
          horizontal="center"
          breakpoints={{ 1024: "column" }}
        >
          <Column
            wrap
            flexGrow={7}
            flexBasis="735px"
            className={css(styles.graphSection)}
            breakpoints={{
              1024: { width: "calc(100% - 48px)", flexBasis: "auto" },
            }}
          >
            <Row wrap horizontal="space-between">
              <Column>
                <span className={css(styles.graphTitle)}>
                  Total time spend on your app (Seconds) (Last 30 days)
                </span>
                <span className={css(styles.graphSubtitle)}>
                  as of {dd} {number_to_month_converter(mm)} {yyyy},{" "}
                  {new Date().toLocaleTimeString()};
                </span>
              </Column>
            </Row>
            {this.state.timeSpendData.length === 0 ? (
              <Skeleton
                variant="rect"
                width={650}
                height={420}
                style={{ marginTop: 20 }}
              />
            ) : (
              <div className={css(styles.graphContainer)}>
                <LineChart
                  data={this.state.timeSpendData}
                  viewBoxWidth={550}
                  pointsStrokeColor="#000"
                  areaColor="#000"
                  areaVisible={false}
                  gridVisible={false}
                  labelsCountY={10}
                  pathColor="#000"
                  pathWidth={2}
                  labelsColor="#888"
                />
              </div>
            )}
          </Column>
          <Column
            className={css(styles.separator)}
            breakpoints={{ 1024: { display: "none" } }}
          >
            <div />
          </Column>
          <Column
            flexGrow={3}
            flexBasis="342px"
            breakpoints={{ 1024: css(styles.stats) }}
          >
            {this.renderStat(
              "App launched (today, so far)",
              `${this.state.appLaunchedToday} times`
            )}
            {this.renderStat(
              "Time spend on app (today, so far)",
              `${this.state.timeSpendToday} minutes`
            )}
            {this.renderStat(
              "In-App Ad showed (today, so far)",
              `${this.state.adSeenToday} times`
            )}
            {this.renderStat(
              "In-App Ad clicked (today, so far)",
              `${this.state.adClickedToday} times`
            )}
          </Column>
        </Row>
        <Row
          flexGrow={1}
          className={css(styles.container)}
          horizontal="center"
          breakpoints={{ 1024: "column" }}
          style={{ marginTop: 30 }}
        >
          <Column
            wrap
            flexGrow={7}
            flexBasis="735px"
            className={css(styles.graphSection)}
            breakpoints={{
              1024: { width: "calc(100% - 48px)", flexBasis: "auto" },
            }}
          >
            <Row wrap horizontal="space-between">
              <Column>
                <span className={css(styles.graphTitle)}>
                  No. of times app launched (Last 30 days)
                </span>
                <span className={css(styles.graphSubtitle)}>
                  as of {dd} {number_to_month_converter(mm)} {yyyy},{" "}
                  {new Date().toLocaleTimeString()};
                </span>
              </Column>
            </Row>
            {this.state.appLaunchedData.length === 0 ? (
              <Skeleton
                variant="rect"
                width={350}
                height={220}
                style={{ marginTop: 20 }}
              />
            ) : (
              <div className={css(styles.graphContainer)}>
                <LineChart
                  data={this.state.appLaunchedData}
                  viewBoxWidth={550}
                  pointsStrokeColor="#000"
                  areaColor="#f00"
                  areaVisible={false}
                  gridVisible={false}
                  labelsCountY={8}
                  pathColor="#f00"
                  labelsColor="#000"
                  pathWidth={3}
                />
              </div>
            )}
          </Column>
          <Column
            className={css(styles.separator)}
            breakpoints={{ 1024: { display: "none" } }}
          >
            <div />
          </Column>
          <Column
            wrap
            flexGrow={7}
            flexBasis="735px"
            className={css(styles.graphSection)}
            breakpoints={{
              1024: { width: "calc(100% - 48px)", flexBasis: "auto" },
            }}
          >
            <Row wrap horizontal="space-between">
              <Column>
                <span className={css(styles.graphTitle)}>
                  No. of times user see In-App Ad (Last 30 days)
                </span>
                <span className={css(styles.graphSubtitle)}>
                  as of {dd} {number_to_month_converter(mm)} {yyyy},{" "}
                  {new Date().toLocaleTimeString()};
                </span>
              </Column>
            </Row>
            {this.state.appLaunchedData.length === 0 ? (
              <Skeleton
                variant="rect"
                width={350}
                height={220}
                style={{ marginTop: 20 }}
              />
            ) : (
              <div className={css(styles.graphContainer)}>
                <LineChart
                  data={this.state.adSeenData}
                  viewBoxWidth={550}
                  pointsStrokeColor="#000"
                  areaColor="#00f"
                  areaVisible={false}
                  labelsCountY={8}
                  gridVisible={false}
                  pathColor="#00f"
                  labelsColor="#000"
                  pathWidth={3}
                />
              </div>
            )}
          </Column>
        </Row>
      </div>
    );
  }
}

export default TodayTrendsComponent;
