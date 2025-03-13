import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        // <div className="min-h-screen">
        //   <div className="">
        //     <h2>Something went wrong.</h2>
        //     <details style={{ whiteSpace: "pre-wrap" }}>
        //     {this.state.error && this.state.error.toString()}
        //     <br />
        //     {this.state.errorInfo && this.state.errorInfo.componentStack}
        //   </details>
        //   </div>
        //   </div>
        <div class="min-vh-100 d-flex justify-content-center align-items-center">
          <div class="text-center shadow p-5 rounded">
            <div className="my-1">
              <span className="text-danger fs-2">
                <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
              </span>
            </div>
            <h1 className="fs-4 py-1">Something went wrong.</h1>
            <h1>Please try again after some time.</h1>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
