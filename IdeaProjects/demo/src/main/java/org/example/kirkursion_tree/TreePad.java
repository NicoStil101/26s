package org.example.kirkursion_tree;

import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.paint.Color;

/**
 * Canvas for drawing the recursive tree.
 * Similar to TUMCarpet structure with drawing pad.
 */
public class TreePad extends Canvas {
    private GraphicsContext gc;
    private double branchAngle = 25.0;
    private double lengthRatio = 0.7;
    private int maxDepth = 10;

    public TreePad(double width, double height) {
        super(width, height);
        gc = this.getGraphicsContext2D();
    }

    /**
     * Clears the canvas and draws the recursive tree.
     */
    public void drawTree() {
        // TODO: Clear the canvas and set up drawing styles (color/line width).
        // TODO: Compute the starting point, initial branch length, and initial angle.
        // TODO: Call the recursive draw function with the initial parameters.
    }

    /**
     * Recursively draws a tree branch.
     * NO LOOPS - purely recursive implementation.
     * 
     * @param x starting x coordinate
     * @param y starting y coordinate
     * @param length length of the branch
     * @param angle angle of the branch in degrees
     * @param depth remaining depth of recursion
     */
    private void drawTree(double x, double y, double length, double angle, int depth) {
        // TODO: Base case: stop recursion when depth reaches 0.
        // TODO: Convert the angle to radians and compute the end point (endX, endY).
        // TODO: Draw the current branch from (x, y) to (endX, endY).
        // TODO: Compute the next branch length using lengthRatio.
        // TODO: Recurse for the left branch with (angle - branchAngle).
        // TODO: Recurse for the right branch with (angle + branchAngle).
    }

    public void setBranchAngle(double branchAngle) {
        this.branchAngle = branchAngle;
    }

    public void setLengthRatio(double lengthRatio) {
        this.lengthRatio = lengthRatio;
    }

    public void setMaxDepth(int maxDepth) {
        this.maxDepth = maxDepth;
    }

    public double getBranchAngle() {
        return branchAngle;
    }

    public double getLengthRatio() {
        return lengthRatio;
    }

    public int getMaxDepth() {
        return maxDepth;
    }
}
