"use client";

import { Component } from "react";

// Keeps a WebGL failure contained to the canvas that failed.
//
// react-three-fiber throws ("Error creating WebGL context") when a context
// can't be acquired — headless browsers, GPU blocklists, hardware acceleration
// switched off, or too many live contexts. React unmounts the whole tree on an
// uncaught render error, so without a boundary one failed canvas takes the
// entire page with it, including the text content. Googlebot renders with
// headless Chrome, which is precisely this case.
//
// The scenes are all decorative, so the fallback is simply nothing: the page
// keeps its text, layout, and links, minus the 3D.
export default class CanvasBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[CanvasBoundary] 3D scene disabled:", error?.message);
    }
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
