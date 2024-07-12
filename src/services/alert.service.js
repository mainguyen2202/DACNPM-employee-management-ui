import { BehaviorSubject } from 'rxjs';

const alertSubject = new BehaviorSubject(null);

export const alertService = {
    alert: alertSubject.asObservable(),
    success,
    error,
    clear,
    warning,
    showToastRight
};

function success(message, showAfterRedirect = false) {
    alertSubject.next({
        type: 'alert-success',
        message,
        showAfterRedirect
    });
}

function error(message, showAfterRedirect = false) {
    alertSubject.next({
        type: 'alert-danger',
        message,
        showAfterRedirect
    });
}
function warning(message, showAfterRedirect = false) {
    alertSubject.next({
        type: 'alert-warning',
        message,
        showAfterRedirect
    });
}
function showToastRight(message, showAfterRedirect = false) {
    alertSubject.next({
        type: 'alert-right',
        message,
        showAfterRedirect
    });
}

// clear alerts
function clear() {
    // if showAfterRedirect flag is true the alert is not cleared
    // for one route change (e.g. after successful registration)
    let alert = alertSubject.value;
    if (alert?.showAfterRedirect) {
        alert.showAfterRedirect = false;
    } else {
        alert = null;
    }
    alertSubject.next(alert);
}