import React from "react";
import { Column, Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import LineChart from "react-svg-line-chart";

const data = [];
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();
for (let x = 1; x <= 30; x++) {
  data.push({ x: x, y: Math.floor(Math.random() * 100) });
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    border: "1px solid #000",
    borderRadius: 4,
    cursor: "pointer"
  },
  graphContainer: {
    marginTop: 24,
    marginLeft: 0,
    marginRight: 0,
    width: "100%"
  },
  graphSection: {
    padding: 24
  },
  graphSubtitle: {
    fontFamily: "Muli",
    fontStyle: "normal",
    fontSize: 14,
    lineHeight: "16px",
    letterSpacing: "0.1px",
    color: "#555",
    marginTop: 4,
    marginRight: 8
  },
  graphTitle: {
    fontFamily: "Muli",
    fontStyle: "normal",
    fontSize: 19,
    lineHeight: "24px",
    letterSpacing: "0.4px",
    color: "#000"
  },
  legendTitle: {
    fontFamily: "Muli",
    fontStyle: "normal",
    fontSize: 12,
    lineHeight: "15px",
    letterSpacing: "0.1px",
    color: "#000",
    marginLeft: 8
  },
  separator: {
    backgroundColor: "#000",
    width: 1,
    minWidth: 1
  },
  statContainer: {
    borderBottom: "1px solid #000",
    padding: "24px 32px 24px 32px",
    height: "calc(114px - 48px)",
    ":last-child": {
      border: "none"
    }
  },
  stats: {
    borderTop: "1px solid #000",
    width: "100%"
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
    marginBottom: 6
  },
  statValue: {
    fontFamily: "Muli",
    fontStyle: "normal",
    fontSize: 24,
    lineHeight: "30px",
    letterSpacing: "0.3px",
    textAlign: "center",
    color: "#000"
  }
});

console.log(data);
const number_to_month_converter = mm => {
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
            1024: { width: "calc(100% - 48px)", flexBasis: "auto" }
          }}
        >
          <Row wrap horizontal="space-between">
            <Column>
              <span className={css(styles.graphTitle)}>Overall trends</span>
              <span className={css(styles.graphSubtitle)}>
                as of {dd} {number_to_month_converter(mm)} {yyyy},{" "}
                {new Date().toLocaleTimeString()};
              </span>
            </Column>
            {this.renderLegend("#3751FF", "Today")}
          </Row>
          <div className={css(styles.graphContainer)}>
            <LineChart
              data={data}
              viewBoxWidth={500}
              pointsStrokeColor="#3751FF"
              areaColor="#3751FF"
              areaVisible={true}
            />
          </div>
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
          {this.renderStat("Resolved", "449")}
          {this.renderStat("Received", "426")}
          {this.renderStat("Average first response time", "33m")}
          {this.renderStat("Average response time", "3h 8m")}
          {this.renderStat("Resolution within SLA", "94%")}
        </Column>
      </Row>
    );
  }
}

export default TodayTrendsComponent;
