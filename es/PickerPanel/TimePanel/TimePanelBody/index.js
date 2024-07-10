import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import useTimeInfo from "../../../hooks/useTimeInfo";
import { formatValue } from "../../../utils/dateUtil";
import { PickerHackContext, usePanelContext } from "../../context";
import TimeColumn from "./TimeColumn";
function isAM(hour) {
  return hour < 12;
}
export default function TimePanelBody(props) {
  var showHour = props.showHour,
    showMinute = props.showMinute,
    showSecond = props.showSecond,
    showMillisecond = props.showMillisecond,
    showMeridiem = props.use12Hours,
    changeOnScroll = props.changeOnScroll;
  var _usePanelContext = usePanelContext(),
    prefixCls = _usePanelContext.prefixCls,
    values = _usePanelContext.values,
    generateConfig = _usePanelContext.generateConfig,
    locale = _usePanelContext.locale,
    onSelect = _usePanelContext.onSelect,
    pickerValue = _usePanelContext.pickerValue;
  var value = (values === null || values === void 0 ? void 0 : values[0]) || null;
  var _React$useContext = React.useContext(PickerHackContext),
    onCellDblClick = _React$useContext.onCellDblClick;

  // ========================== Info ==========================
  var _useTimeInfo = useTimeInfo(generateConfig, props, value),
    _useTimeInfo2 = _slicedToArray(_useTimeInfo, 5),
    getValidTime = _useTimeInfo2[0],
    rowHourUnits = _useTimeInfo2[1],
    getMinuteUnits = _useTimeInfo2[2],
    getSecondUnits = _useTimeInfo2[3],
    getMillisecondUnits = _useTimeInfo2[4];

  // ========================= Value ==========================
  // PickerValue will tell which one to align on the top
  var getUnitValue = function getUnitValue(func) {
    var valueUnitVal = value && generateConfig[func](value);
    var pickerUnitValue = pickerValue && generateConfig[func](pickerValue);
    return [valueUnitVal, pickerUnitValue];
  };
  var _getUnitValue = getUnitValue('getHour'),
    _getUnitValue2 = _slicedToArray(_getUnitValue, 2),
    hour = _getUnitValue2[0],
    pickerHour = _getUnitValue2[1];
  var _getUnitValue3 = getUnitValue('getMinute'),
    _getUnitValue4 = _slicedToArray(_getUnitValue3, 2),
    minute = _getUnitValue4[0],
    pickerMinute = _getUnitValue4[1];
  var _getUnitValue5 = getUnitValue('getSecond'),
    _getUnitValue6 = _slicedToArray(_getUnitValue5, 2),
    second = _getUnitValue6[0],
    pickerSecond = _getUnitValue6[1];
  var _getUnitValue7 = getUnitValue('getMillisecond'),
    _getUnitValue8 = _slicedToArray(_getUnitValue7, 2),
    millisecond = _getUnitValue8[0],
    pickerMillisecond = _getUnitValue8[1];
  var meridiem = hour === null ? null : isAM(hour) ? 'am' : 'pm';

  // ========================= Column =========================
  // Hours
  var hourUnits = React.useMemo(function () {
    if (!showMeridiem) {
      return rowHourUnits;
    }
    return isAM(hour) ? rowHourUnits.filter(function (h) {
      return isAM(h.value);
    }) : rowHourUnits.filter(function (h) {
      return !isAM(h.value);
    });
  }, [hour, rowHourUnits, showMeridiem]);

  // >>> Pick Fallback
  var getEnabled = function getEnabled(units, val) {
    var _enabledUnits$;
    var enabledUnits = units.filter(function (unit) {
      return !unit.disabled;
    });
    return val !== null && val !== void 0 ? val : // Fallback to enabled value
    enabledUnits === null || enabledUnits === void 0 || (_enabledUnits$ = enabledUnits[0]) === null || _enabledUnits$ === void 0 ? void 0 : _enabledUnits$.value;
  };

  // >>> Minutes
  var validHour = getEnabled(rowHourUnits, hour);
  var minuteUnits = React.useMemo(function () {
    return getMinuteUnits(validHour);
  }, [getMinuteUnits, validHour]);

  // >>> Seconds
  var validMinute = getEnabled(minuteUnits, minute);
  var secondUnits = React.useMemo(function () {
    return getSecondUnits(validHour, validMinute);
  }, [getSecondUnits, validHour, validMinute]);

  // >>> Milliseconds
  var validSecond = getEnabled(secondUnits, second);
  var millisecondUnits = React.useMemo(function () {
    return getMillisecondUnits(validHour, validMinute, validSecond);
  }, [getMillisecondUnits, validHour, validMinute, validSecond]);
  var validMillisecond = getEnabled(millisecondUnits, millisecond);

  // Meridiem
  var meridiemUnits = React.useMemo(function () {
    if (!showMeridiem) {
      return [];
    }
    var base = generateConfig.getNow();
    var amDate = generateConfig.setHour(base, 6);
    var pmDate = generateConfig.setHour(base, 18);
    var formatMeridiem = function formatMeridiem(date, defaultLabel) {
      var cellMeridiemFormat = locale.cellMeridiemFormat;
      return cellMeridiemFormat ? formatValue(date, {
        generateConfig: generateConfig,
        locale: locale,
        format: cellMeridiemFormat
      }) : defaultLabel;
    };
    return [{
      label: formatMeridiem(amDate, 'AM'),
      value: 'am',
      disabled: rowHourUnits.every(function (h) {
        return h.disabled || !isAM(h.value);
      })
    }, {
      label: formatMeridiem(pmDate, 'PM'),
      value: 'pm',
      disabled: rowHourUnits.every(function (h) {
        return h.disabled || isAM(h.value);
      })
    }];
  }, [rowHourUnits, showMeridiem, generateConfig, locale]);

  // ========================= Change =========================
  /**
   * Check if time is validate or will match to validate one
   */
  var triggerChange = function triggerChange(nextDate) {
    var validateDate = getValidTime(nextDate);
    onSelect(validateDate);
  };

  // ========================= Column =========================
  // Create a template date for the trigger change event
  var triggerDateTmpl = React.useMemo(function () {
    var tmpl = value || pickerValue || generateConfig.getNow();
    var isNotNull = function isNotNull(num) {
      return num !== null && num !== undefined;
    };
    if (isNotNull(hour)) {
      tmpl = generateConfig.setHour(tmpl, hour);
      tmpl = generateConfig.setMinute(tmpl, minute);
      tmpl = generateConfig.setSecond(tmpl, second);
      tmpl = generateConfig.setMillisecond(tmpl, millisecond);
    } else if (isNotNull(pickerHour)) {
      tmpl = generateConfig.setHour(tmpl, pickerHour);
      tmpl = generateConfig.setMinute(tmpl, pickerMinute);
      tmpl = generateConfig.setSecond(tmpl, pickerSecond);
      tmpl = generateConfig.setMillisecond(tmpl, pickerMillisecond);
    } else if (isNotNull(validHour)) {
      tmpl = generateConfig.setHour(tmpl, validHour);
      tmpl = generateConfig.setMinute(tmpl, validMinute);
      tmpl = generateConfig.setSecond(tmpl, validSecond);
      tmpl = generateConfig.setMillisecond(tmpl, validMillisecond);
    }
    return tmpl;
  }, [value, pickerValue, hour, minute, second, millisecond, validHour, validMinute, validSecond, validMillisecond, pickerHour, pickerMinute, pickerSecond, pickerMillisecond, generateConfig]);
  var onHourChange = function onHourChange(val) {
    triggerChange(generateConfig.setHour(triggerDateTmpl, val));
  };
  var onMinuteChange = function onMinuteChange(val) {
    triggerChange(generateConfig.setMinute(triggerDateTmpl, val));
  };
  var onSecondChange = function onSecondChange(val) {
    triggerChange(generateConfig.setSecond(triggerDateTmpl, val));
  };
  var onMillisecondChange = function onMillisecondChange(val) {
    triggerChange(generateConfig.setMillisecond(triggerDateTmpl, val));
  };
  var onMeridiemChange = function onMeridiemChange(val) {
    if (val === 'am' && !isAM(hour)) {
      triggerChange(generateConfig.setHour(triggerDateTmpl, hour - 12));
    } else if (val === 'pm' && isAM(hour)) {
      triggerChange(generateConfig.setHour(triggerDateTmpl, hour + 12));
    }
  };

  // ========================= Render =========================
  var sharedColumnProps = {
    onDblClick: onCellDblClick,
    changeOnScroll: changeOnScroll
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "".concat(prefixCls, "-content")
  }, showHour && /*#__PURE__*/React.createElement(TimeColumn, _extends({
    units: hourUnits,
    value: hour,
    optionalValue: pickerHour,
    type: "hour",
    onChange: onHourChange
  }, sharedColumnProps)), showMinute && /*#__PURE__*/React.createElement(TimeColumn, _extends({
    units: minuteUnits,
    value: minute,
    optionalValue: pickerMinute,
    type: "minute",
    onChange: onMinuteChange
  }, sharedColumnProps)), showSecond && /*#__PURE__*/React.createElement(TimeColumn, _extends({
    units: secondUnits,
    value: second,
    optionalValue: pickerSecond,
    type: "second",
    onChange: onSecondChange
  }, sharedColumnProps)), showMillisecond && /*#__PURE__*/React.createElement(TimeColumn, _extends({
    units: millisecondUnits,
    value: millisecond,
    optionalValue: pickerMillisecond,
    type: "millisecond",
    onChange: onMillisecondChange
  }, sharedColumnProps)), showMeridiem && /*#__PURE__*/React.createElement(TimeColumn, _extends({
    units: meridiemUnits,
    value: meridiem,
    type: "meridiem",
    onChange: onMeridiemChange
  }, sharedColumnProps)));
}