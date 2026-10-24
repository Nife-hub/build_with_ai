// The "Leave this round?" card shown over the Practice screen when Back is pressed.
export default function LeaveDialog({ onStay, onLeave }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="leave-title">
      <div className="card dialog">
        <p id="leave-title" className="dialog-title">Leave this round? Your progress won't be saved.</p>
        <div className="row">
          <button className="btn btn-main" onClick={onStay} autoFocus>Keep practicing</button>
          <button className="btn btn-small" onClick={onLeave}>Leave</button>
        </div>
      </div>
    </div>
  );
}
