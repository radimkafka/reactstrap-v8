import { targetPropType } from './utils';

// Legacy no-op. This component relied on react-popper 0.x's `popperManager`
// legacy context, which no longer exists (PopperContent passes the target
// element to react-popper directly via `referenceElement`). The legacy context
// API was also removed in React 19, so the component simply renders nothing.
// Kept as a public export for backwards compatibility.
const PopperTargetHelper = () => null;

PopperTargetHelper.propTypes = {
  target: targetPropType.isRequired,
};

export default PopperTargetHelper;
