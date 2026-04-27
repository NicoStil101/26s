package com.GitLost.MazeRunner.ui;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Screen;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Skin;
import com.badlogic.gdx.scenes.scene2d.ui.Table;
import com.badlogic.gdx.scenes.scene2d.ui.TextButton;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.ScreenViewport;
import com.badlogic.gdx.scenes.scene2d.ui.ImageTextButton;



public class MainMenuScreen implements Screen{

    private Stage stage;



    @Override
    public void show() {
        //ScreenPort parameter for resizing
        stage = new Stage(new ScreenViewport());
        Gdx.input.setInputProcessor(stage);
        Skin skin = new Skin(Gdx.files.internal("biological-attack-ui.json"));

        Table table = new Table();
        table.setFillParent(true);
        stage.addActor(table);

        ImageTextButton start = new ImageTextButton("Start", skin);
        ImageTextButton exit = new ImageTextButton("Settings", skin);
        ImageTextButton quit = new ImageTextButton("Quit Game", skin);

        table.add(start).pad(10).row();
        table.add(exit).pad(10).row();
        table.add(quit).pad(10);
    }
//    @Override
//    public void create(){
//        setScreen(new TestScreen());
//    }

    @Override
    public void render(float v) {
        ScreenUtils.clear(0.0f, 0.3f, 0.0f, 1.0f); //color of screen
        stage.act(v);
        stage.draw();
    }

    @Override
    public void resize(int i, int i1) {
        if (stage != null) {
            stage.getViewport().update(i, i1, true);
        }
    }

    @Override
    public void pause() {

    }

    @Override
    public void resume() {

    }

    @Override
    public void hide() {

    }

    @Override
    public void dispose() {
        stage.dispose();
    }


}
