package org.example.kirkursion_tree;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

/**
 * JavaFX Recursive Tree Application.
 * Main entry point for the recursive tree visualization.
 */
public class KirkursionTree extends Application {

    @Override
    public void start(Stage primaryStage) {
        MainScreen mainScreen = new MainScreen(800, 700);
        
        Scene scene = new Scene(mainScreen, 800, 700);
        
        primaryStage.setTitle("Recursive Tree Visualization");
        primaryStage.setScene(scene);
        primaryStage.setResizable(false);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
