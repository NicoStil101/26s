package org.example.kirkursion_tree;

import java.awt.*;

/**
 * Represents a tree branch with start and end points.
 */
public class Branch {
    private Point start;
    private Point end;
    private double angle;

    public Branch(Point start, Point end, double angle) {
        this.start = start;
        this.end = end;
        this.angle = angle;
    }

    public Point getStart() {
        return start;
    }

    public Point getEnd() {
        return end;
    }

    public double getAngle() {
        return angle;
    }

    public void setStart(Point start) {
        this.start = start;
    }

    public void setEnd(Point end) {
        this.end = end;
    }

    public void setAngle(double angle) {
        this.angle = angle;
    }
}
