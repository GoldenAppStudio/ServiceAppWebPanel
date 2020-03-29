import React, { useCallback, useEffect, useState, useRef } from "react";
import { Column, Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import LogoComponent from "./LogoComponent";
import MenuItemComponent from "./MenuItemComponent";
import IconTickets from "../../assets/icon-tickets.js";
import IconIdeas from "../../assets/icon-ideas.js";
import IconContacts from "../../assets/icon-contacts";
import AppsIcon from "@material-ui/icons/Apps";
import IconAgents from "../../assets/icon-agents";
import IconBellNew from "../../assets/icon-bell-new";
import IconArticles from "../../assets/icon-articles";
import IconSettings from "../../assets/icon-settings";
import IconSubscription from "../../assets/icon-subscription";
import IconBurger from "../../assets/icon-burger";
import iconSearch from "../../assets/icon-search";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
const styles = StyleSheet.create({
  burgerIcon: {
    cursor: "pointer",
    position: "absolute",
    left: 24,
    top: 34
  },
  container: {
    backgroundColor: "#363740",
    width: 255,
    paddingTop: 32,
    height: "calc(100% - 32px)"
  },
  containerMobile: {
    transition: "left 0.5s, right 0.5s",
    position: "absolute",
    width: 255,
    height: "calc(100% - 32px)",
    zIndex: 901
  },
  mainContainer: {
    height: "100%",
    minHeight: "100vh"
  },
  mainContainerMobile: {
    position: "absolute",
    top: 0,
    left: 0
  },
  mainContainerExpanded: {
    width: "100%",
    minWidth: "100vh"
  },
  menuItemList: {
    marginTop: 35
  },
  outsideLayer: {
    position: "absolute",
    width: "100vw",
    minWidth: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,.50)",
    zIndex: 900
  },
  separator: {
    borderTop: "1px solid #ABCDEF",
    marginTop: 12,
    marginBottom: 12,
    opacity: 0.06
  },
  hide: {
    left: -255
  },
  show: {
    left: 0
  }
});

function SidebarComponent({ onChange, selectedItem }) {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const input1 = useRef(null);

  const [, updateState] = React.useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  /**
   * This is to fix this issue:
   * https://github.com/llorentegerman/react-admin-dashboard/issues/8
   * I haven't been able to reproduce this bug in Safari 13.0.5 (14608.5.12)
   */
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    forceUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerWidth]);

  const onItemClicked = item => {
    setExpanded(false);
    return onChange(item);
  };

  const toggleMenu = () => setExpanded(!expanded);

  const renderBurger = () => {
    return (
      <div onClick={toggleMenu} className={css(styles.burgerIcon)}>
        <IconBurger />
      </div>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <Row
        componentRef={element => (input1.current = element)}
        className={css(styles.mainContainer)}
        breakpoints={{
          768: css(
            styles.mainContainerMobile,
            expanded && styles.mainContainerExpanded
          )
        }}
      >
        {isMobile && !expanded && renderBurger()}
        <Column
          className={css(styles.container)}
          breakpoints={{
            768: css(
              styles.containerMobile,
              expanded ? styles.show : styles.hide
            )
          }}
        >
          <LogoComponent />
          <Column className={css(styles.menuItemList)}>
            <MenuItemComponent
              title="OverView"
              icon={IconTickets}
              onClick={() => onItemClicked("OverView")}
              active={selectedItem === "OverView"}
            />
            <MenuItemComponent
              title="General Explorer"
              icon={IconIdeas}
              onClick={() => onItemClicked("Travel")}
              active={selectedItem === "Travel"}
            />
            <MenuItemComponent
              title="Add Services"
              icon={IconContacts}
              onClick={() => onItemClicked("Add")}
              active={selectedItem === "Add"}
            />
            <MenuItemComponent
              title="Edit Services"
              icon={IconAgents}
              onClick={() => onItemClicked("Edit")}
              active={selectedItem === "Edit"}
            />

            <MenuItemComponent
              title="Service Provider"
              icon={IconBellNew}
              onClick={() => onItemClicked("SP")}
              active={selectedItem === "SP"}
            />
            <MenuItemComponent
              title="New Requests"
              icon={NewReleasesIcon}
              onClick={() => onItemClicked("NSP")}
              active={selectedItem === "NSP"}
            />
            <MenuItemComponent
              title="In-App Ads"
              icon={iconSearch}
              onClick={() => onItemClicked("Ad")}
              active={selectedItem === "Ad"}
            />
            <div className={css(styles.separator)}></div>
            <MenuItemComponent
              title="Settings"
              icon={IconSettings}
              onClick={() => onItemClicked("Settings")}
              active={selectedItem === "Settings"}
            />
            <MenuItemComponent
              title="Developers"
              icon={IconSubscription}
              onClick={() => onItemClicked("Subscription")}
              active={selectedItem === "Subscription"}
            />
          </Column>
        </Column>
        {isMobile && expanded && (
          <div className={css(styles.outsideLayer)} onClick={toggleMenu}></div>
        )}
      </Row>
    </div>
  );
}

export default SidebarComponent;
