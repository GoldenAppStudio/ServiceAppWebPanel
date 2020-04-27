import React from "react";
import { Column, Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import SidebarComponent from "./components/sidebar/SidebarComponent";
import ContentComponent from "./components/content/ContentComponent";
import "./App.css";
import AddService from "./components/component/AddService";
import EditService from "./components/component/EditService";
import Travel from "./components/component/Travel";
import NewServiceProvider from "./components/component/NewServiceProvider";
import AdsManagement from "./components/component/AdsManagement";
import ServiceProvider from "./components/component/ServiceProvider";
import DeleteTheService from "./components/component/DeleteTheService";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    minHeight: "100vh",
  },

  mainBlock: {
    backgroundColor: "#F7F8FC",
    padding: 20,
  },
});

class App extends React.Component {
  state = { selectedItem: "Tickets" };

  componentDidMount() {
    window.addEventListener("resize", this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  renderSwitch(param) {
    switch (param) {
      case "Add":
        return <AddService />;
      case "Travel":
        return <Travel />;
      case "OverView":
        return <ContentComponent />;
      case "Edit":
        return <EditService />;
      case "DEL":
        return <DeleteTheService />;
      case "NSP":
        return <NewServiceProvider />;
      case "Ad":
        return <AdsManagement />;
      case "SP":
        return <ServiceProvider />;
      default:
        return <ContentComponent />;
    }
  }

  resize = () => this.forceUpdate();

  render() {
    const { selectedItem } = this.state;

    return (
      <Row className={css(styles.container)}>
        <SidebarComponent
          selectedItem={selectedItem}
          onChange={(selectedItem) => this.setState({ selectedItem })}
        />
        <Column flexGrow={1} className={css(styles.mainBlock)}>
          <div className={css(styles.content)}>
            {this.renderSwitch(selectedItem)}
          </div>
        </Column>
      </Row>
    );
  }
}

export default App;
