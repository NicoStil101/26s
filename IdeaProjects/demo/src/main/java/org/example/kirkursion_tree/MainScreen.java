package org.example.kirkursion_tree;

import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.Slider;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;

/**
 * Main screen with sliders for controlling tree parameters.
 * Similar to TUMCarpet structure.
 */
public class MainScreen extends BorderPane {
    private TreePad treePad;
    private Slider depthSlider;
    private Slider angleSlider;
    private Slider ratioSlider;
    private Label depthLabel;
    private Label angleLabel;
    private Label ratioLabel;

    public MainScreen(double width, double height) {
        treePad = new TreePad(width, height - 150);
        
        // Create controls
        createControls();
        
        // Layout
        setCenter(treePad);
        setBottom(createControlPanel());
        
        // Draw initial tree
        treePad.drawTree();
    }

    private void createControls() {
        // Depth slider (recursion depth)
        depthSlider = new Slider(1, 15, 10);
        depthSlider.setShowTickLabels(true);
        depthSlider.setShowTickMarks(true);
        depthSlider.setMajorTickUnit(1);
        depthSlider.setBlockIncrement(1);
        depthSlider.setSnapToTicks(true);
        depthLabel = new Label("Depth: " + (int) depthSlider.getValue());
        
        depthSlider.valueProperty().addListener((obs, oldVal, newVal) -> {
            int depth = newVal.intValue();
            depthLabel.setText("Depth: " + depth);
            treePad.setMaxDepth(depth);
            treePad.drawTree();
        });

        // Angle slider (branch angle in degrees)
        angleSlider = new Slider(5, 60, 25);
        angleSlider.setShowTickLabels(true);
        angleSlider.setShowTickMarks(true);
        angleSlider.setMajorTickUnit(5);
        angleLabel = new Label(String.format("Angle: %.1f°", angleSlider.getValue()));
        
        angleSlider.valueProperty().addListener((obs, oldVal, newVal) -> {
            double angle = newVal.doubleValue();
            angleLabel.setText(String.format("Angle: %.1f°", angle));
            treePad.setBranchAngle(angle);
            treePad.drawTree();
        });

        // Ratio slider (length ratio for child branches)
        ratioSlider = new Slider(0.5, 0.9, 0.7);
        ratioSlider.setShowTickLabels(true);
        ratioSlider.setShowTickMarks(true);
        ratioSlider.setMajorTickUnit(0.1);
        ratioLabel = new Label(String.format("Length Ratio: %.2f", ratioSlider.getValue()));
        
        ratioSlider.valueProperty().addListener((obs, oldVal, newVal) -> {
            double ratio = newVal.doubleValue();
            ratioLabel.setText(String.format("Length Ratio: %.2f", ratio));
            treePad.setLengthRatio(ratio);
            treePad.drawTree();
        });
    }

    private VBox createControlPanel() {
        VBox controlPanel = new VBox(15);
        controlPanel.setPadding(new Insets(10));
        controlPanel.setAlignment(Pos.CENTER);

        // Depth control
        VBox depthBox = new VBox(5);
        depthBox.setAlignment(Pos.CENTER);
        depthSlider.setPrefWidth(300);
        depthBox.getChildren().addAll(depthLabel, depthSlider);

        // Angle control
        VBox angleBox = new VBox(5);
        angleBox.setAlignment(Pos.CENTER);
        angleSlider.setPrefWidth(300);
        angleBox.getChildren().addAll(angleLabel, angleSlider);

        // Ratio control
        VBox ratioBox = new VBox(5);
        ratioBox.setAlignment(Pos.CENTER);
        ratioSlider.setPrefWidth(300);
        ratioBox.getChildren().addAll(ratioLabel, ratioSlider);

        // Add all controls
        HBox allControls = new HBox(20);
        allControls.setAlignment(Pos.CENTER);
        allControls.getChildren().addAll(depthBox, angleBox, ratioBox);

        // Reset button
        Button resetButton = new Button("Reset");
        resetButton.setOnAction(e -> {
            depthSlider.setValue(10);
            angleSlider.setValue(25);
            ratioSlider.setValue(0.7);
        });

        controlPanel.getChildren().addAll(allControls, resetButton);
        return controlPanel;
    }
}
