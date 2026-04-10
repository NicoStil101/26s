module org.example.kirkursion_tree {
	requires javafx.controls;
	requires javafx.fxml;
	requires java.desktop;

	opens org.example.kirkursion_tree to javafx.fxml;
	exports org.example.kirkursion_tree;
}
