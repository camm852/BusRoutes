import './Spinner.css';

export default function Spinner({
  otherColor,
  big
}: {
  otherColor?: boolean;
  big?: boolean;
}): JSX.Element {
  return (
    <div className={`spinner ${big ? 'big-spinner' : ''}`}>
      <div className={`double-bounce1 ${otherColor ? 'other-color' : ''} `} />
      <div className={`double-bounce2 ${otherColor ? 'other-color' : ''} `} />
    </div>
  );
}

Spinner.defaultProps = {
  otherColor: false,
  big: false
};
