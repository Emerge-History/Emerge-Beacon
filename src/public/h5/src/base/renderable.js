function zsort(a, b) {
    return a.zIndex - b.zIndex;
}

export class Renderable {

    constructor() {
        this.FBO = document.createElement("canvas");
        this.Children = [];
        this.ChildrenZSort = true;
        this.Parent = undefined;
        this._zsort = undefined;
        this._pendingremoval = false;
        this._dirtyz = false;
        this._zindex = 0;
    }

    set zIndex(val) {
        this._zindex = val;
        if (this.Parent) {
            this.Parent._dirtyz = true;
        }
    }

    get zIndex() {
        return this._zindex;
    }

    update(dT) {
        let len = this.Children.length;
        for (var i = 0; i < len; i++) {
            let cur = this.Children.pop();
            cur.update();
            if (!cur._pendingremoval) {
                this.Children.unshift(cur);
            }
            cur.update(dT);
        }
    }

    draw(ctx) {
        //z-sort
        if (this.ChildrenZSort && this._dirtyz) {
            this._zsort = this.Children.slice(0).sort(zsort);
            this._dirtyz = false;
        }
        let list = this.ChildrenZSort ? this._zsort : this.Children;
        for (let cur in list) {
            list[cur].draw(ctx);
        }
    }

    append(renderable) {
        if (-1 == this.Children.indexOf(renderable)) {
            this.Children.push(renderable);
            renderable.Parent = this;
            this._dirtyz = true;
        }
    }

    appendTo(parent) {
        parent.append(this);
    }

    removeFromParent() {
        this._pendingremoval = true;
    }

    remove(i_or_obj) {
        if (i_or_obj + 1 > 1) {
            this.Children[i_or_obj].removeFromParent();
            this._dirtyz = true;
        } else {
            i_or_obj.removeFromParent();
            this._dirtyz = true;
        }
    }
}
