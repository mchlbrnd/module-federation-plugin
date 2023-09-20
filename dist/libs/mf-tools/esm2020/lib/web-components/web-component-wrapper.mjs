import { Component, ElementRef, Input, ViewChild, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { loadRemoteModule, } from '@angular-architects/module-federation';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class WebComponentWrapper {
    constructor(route) {
        this.route = route;
    }
    ngOnChanges() {
        if (!this.element)
            return;
        this.populateProps();
    }
    populateProps() {
        for (const prop in this.props) {
            this.element[prop] = this.props[prop];
        }
    }
    setupEvents() {
        for (const event in this.events) {
            this.element.addEventListener(event, this.events[event]);
        }
    }
    async ngAfterContentInit() {
        const options = this.options ?? this.route.snapshot.data;
        try {
            await loadRemoteModule(options);
            this.element = document.createElement(options.elementName);
            this.populateProps();
            this.setupEvents();
            this.vc.nativeElement.appendChild(this.element);
        }
        catch (error) {
            console.error(error);
        }
    }
}
WebComponentWrapper.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.1", ngImport: i0, type: WebComponentWrapper, deps: [{ token: i1.ActivatedRoute }], target: i0.ɵɵFactoryTarget.Component });
WebComponentWrapper.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.1.1", type: WebComponentWrapper, selector: "mft-wc-wrapper", inputs: { options: "options", props: "props", events: "events" }, viewQueries: [{ propertyName: "vc", first: true, predicate: ["vc"], descendants: true, read: ElementRef, static: true }], usesOnChanges: true, ngImport: i0, template: '<div #vc></div>', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.1", ngImport: i0, type: WebComponentWrapper, decorators: [{
            type: Component,
            args: [{
                    // eslint-disable-next-line @angular-eslint/component-selector
                    selector: 'mft-wc-wrapper',
                    template: '<div #vc></div>',
                }]
        }], ctorParameters: function () { return [{ type: i1.ActivatedRoute }]; }, propDecorators: { vc: [{
                type: ViewChild,
                args: ['vc', { read: ElementRef, static: true }]
            }], options: [{
                type: Input
            }], props: [{
                type: Input
            }], events: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLWNvbXBvbmVudC13cmFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9tZi10b29scy9zcmMvbGliL3dlYi1jb21wb25lbnRzL3dlYi1jb21wb25lbnQtd3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBRUwsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwsZ0JBQWdCLEdBQ2pCLE1BQU0sdUNBQXVDLENBQUM7OztBQVcvQyxrRUFBa0U7QUFDbEUsTUFBTSxPQUFPLG1CQUFtQjtJQVU5QixZQUFvQixLQUFxQjtRQUFyQixVQUFLLEdBQUwsS0FBSyxDQUFnQjtJQUFHLENBQUM7SUFFN0MsV0FBVztRQUNULElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTztZQUFFLE9BQU87UUFFMUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFTyxhQUFhO1FBQ25CLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBRU8sV0FBVztRQUNqQixLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQzFEO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxrQkFBa0I7UUFDdEIsTUFBTSxPQUFPLEdBQ1gsSUFBSSxDQUFDLE9BQU8sSUFBSyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFtQyxDQUFDO1FBRTNFLElBQUk7WUFDRixNQUFNLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWhDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUVuQixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pEO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3RCO0lBQ0gsQ0FBQzs7Z0hBN0NVLG1CQUFtQjtvR0FBbkIsbUJBQW1CLDZMQUNMLFVBQVUsZ0VBSnpCLGlCQUFpQjsyRkFHaEIsbUJBQW1CO2tCQU4vQixTQUFTO21CQUFDO29CQUNULDhEQUE4RDtvQkFDOUQsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsUUFBUSxFQUFFLGlCQUFpQjtpQkFDNUI7cUdBSUMsRUFBRTtzQkFERCxTQUFTO3VCQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFHMUMsT0FBTztzQkFBZixLQUFLO2dCQUNHLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge1xuICBMb2FkUmVtb3RlTW9kdWxlT3B0aW9ucyxcbiAgbG9hZFJlbW90ZU1vZHVsZSxcbn0gZnJvbSAnQGFuZ3VsYXItYXJjaGl0ZWN0cy9tb2R1bGUtZmVkZXJhdGlvbic7XG5cbmV4cG9ydCB0eXBlIFdlYkNvbXBvbmVudFdyYXBwZXJPcHRpb25zID0gTG9hZFJlbW90ZU1vZHVsZU9wdGlvbnMgJiB7XG4gIGVsZW1lbnROYW1lOiBzdHJpbmc7XG59O1xuXG5AQ29tcG9uZW50KHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9jb21wb25lbnQtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdtZnQtd2Mtd3JhcHBlcicsXG4gIHRlbXBsYXRlOiAnPGRpdiAjdmM+PC9kaXY+Jyxcbn0pXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L2NvbXBvbmVudC1jbGFzcy1zdWZmaXhcbmV4cG9ydCBjbGFzcyBXZWJDb21wb25lbnRXcmFwcGVyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzIHtcbiAgQFZpZXdDaGlsZCgndmMnLCB7IHJlYWQ6IEVsZW1lbnRSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICB2YzogRWxlbWVudFJlZjtcblxuICBASW5wdXQoKSBvcHRpb25zOiBXZWJDb21wb25lbnRXcmFwcGVyT3B0aW9ucztcbiAgQElucHV0KCkgcHJvcHM6IHsgW3Byb3A6IHN0cmluZ106IHVua25vd24gfTtcbiAgQElucHV0KCkgZXZlbnRzOiB7IFtldmVudDogc3RyaW5nXTogKGV2ZW50OiBFdmVudCkgPT4gdm9pZCB9O1xuXG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlKSB7fVxuXG4gIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5lbGVtZW50KSByZXR1cm47XG5cbiAgICB0aGlzLnBvcHVsYXRlUHJvcHMoKTtcbiAgfVxuXG4gIHByaXZhdGUgcG9wdWxhdGVQcm9wcygpIHtcbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gdGhpcy5wcm9wcykge1xuICAgICAgdGhpcy5lbGVtZW50W3Byb3BdID0gdGhpcy5wcm9wc1twcm9wXTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldHVwRXZlbnRzKCkge1xuICAgIGZvciAoY29uc3QgZXZlbnQgaW4gdGhpcy5ldmVudHMpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCB0aGlzLmV2ZW50c1tldmVudF0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBjb25zdCBvcHRpb25zID1cbiAgICAgIHRoaXMub3B0aW9ucyA/PyAodGhpcy5yb3V0ZS5zbmFwc2hvdC5kYXRhIGFzIFdlYkNvbXBvbmVudFdyYXBwZXJPcHRpb25zKTtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBsb2FkUmVtb3RlTW9kdWxlKG9wdGlvbnMpO1xuXG4gICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG9wdGlvbnMuZWxlbWVudE5hbWUpO1xuICAgICAgdGhpcy5wb3B1bGF0ZVByb3BzKCk7XG4gICAgICB0aGlzLnNldHVwRXZlbnRzKCk7XG5cbiAgICAgIHRoaXMudmMubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==