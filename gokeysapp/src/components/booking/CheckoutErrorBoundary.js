"use client";

import { Component } from "react";

// Any unexpected error inside the checkout shows this message instead of the whole page failing. No seats are held
// by the error itself; a hold that was made expires on its own.
export default class CheckoutErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Checkout error", error?.message); // the message only: never form contents
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="gk-panel p-6 max-w-xl" role="alert">
        <h1 className="gk-h3 mb-2">Something went wrong, please reload</h1>
        <p className="text-[15px] text-ink">The booking form hit a problem. Reload the page to start again; nothing has been charged.</p>
        <p className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="gk-btn gk-btn-ink" onClick={() => window.location.reload()}>Reload the page</button>
          <a href="tel:+917830718687" className="gk-btn gk-btn-line">Call +91-7830718687</a>
        </p>
      </div>
    );
  }
}
