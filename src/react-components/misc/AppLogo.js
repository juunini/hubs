import React from "react";
import PropTypes from "prop-types";

import configs from "../../utils/configs";

export function AppLogo({ className }) {
  return <img className={className} alt={configs.translation("app-name")} src={window.XRCLOUD?.logoUrl} />;
}

AppLogo.propTypes = {
  className: PropTypes.string,
};
