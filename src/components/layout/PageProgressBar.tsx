
'use client';

import { useEffect } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

const PageProgressBar = () => {
  useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();
    const handleRouteError = () => NProgress.done();

    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteError);

    // On initial mount, if a route change is already in progress (e.g. from server component redirect),
    // ensure NProgress.done() is called when the client hydrates and the route is complete.
    // This handles cases where NProgress.start() might be missed by the client.
    if (Router.router?.isSsr && NProgress.isStarted()) {
        NProgress.done();
    }
    
    // Initial done call for cases where the page loads fully without route change events firing client-side
    // e.g. first load, or when navigating back/forward and page is cached.
    NProgress.done();


    return () => {
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteError);
    };
  }, []);

  return (
    <style jsx global>{`
      #nprogress .bar {
        background: hsl(var(--accent)) !important;
        height: 3px !important;
        z-index: 99999 !important; /* Ensure it's above other elements */
      }
      #nprogress .peg {
        box-shadow: 0 0 10px hsl(var(--accent)), 0 0 5px hsl(var(--accent)) !important;
      }
    `}</style>
  );
};

export default PageProgressBar;
