import React from 'react';

import { NumericFormat, NumericFormatProps } from 'react-number-format';

const NumberFormat: React.FC<NumericFormatProps> = ({
  displayType = 'text',
  prefix = '',
  suffix = ' đ',
  decimalSeparator = ',',
  value,
  fixedDecimalScale = true,
  decimalScale = 0,
  thousandsGroupStyle = 'thousand',
  thousandSeparator = '.',
  ...props
}) => {
  return (
    <NumericFormat
      prefix={prefix}
      suffix={suffix}
      decimalSeparator={decimalSeparator}
      displayType={displayType}
      value={value ?? 0}
      fixedDecimalScale={fixedDecimalScale}
      decimalScale={decimalScale}
      thousandsGroupStyle={thousandsGroupStyle}
      thousandSeparator={thousandSeparator}
      {...props}
    />
  );
};

export default React.memo(NumberFormat);
